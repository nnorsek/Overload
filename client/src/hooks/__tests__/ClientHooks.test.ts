import { renderHook, act, waitFor } from "@testing-library/react";
import { useClientHooks } from "../ClientHooks";

vi.mock("../useApi", () => ({
  useApi: () => ({
    apiBase: "http://localhost:8080",
    authHeaders: { "Content-Type": "application/json" },
    user: { id: 1, token: "test-token" },
    GENERIC_ERROR: "Something went wrong, please try again.",
    throwIfNotOK: async (res: Response) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? res.statusText);
      }
    },
  }),
}));

function makeResponse(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

const mockClients = [
  {
    clientId: 1,
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1990-01-01",
    gender: "Female",
    startingWeight: 140,
    currentWeight: 135,
    height: 65,
    goal: "Lose weight",
    photoUrl: "",
    startedAt: "2026-01-01",
  },
  {
    clientId: 2,
    firstName: "Bob",
    lastName: "Jones",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    startingWeight: 200,
    currentWeight: 190,
    height: 72,
    goal: "Build muscle",
    photoUrl: "",
    startedAt: "2026-02-01",
  },
];

const mockClient = mockClients[0];

describe("useClientHooks", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(mockClients)));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches all clients on mount with the correct URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(mockClients));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useClientHooks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/client/all",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
  });

  it("populates clients state on successful fetch", async () => {
    const { result } = renderHook(() => useClientHooks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.error).toBeNull();
  });

  it("sets error state when fetch returns 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(null, false)));

    const { result } = renderHook(() => useClientHooks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Something went wrong, please try again.");
    expect(result.current.clients).toEqual([]);
  });

  it("reloader toggles reload and triggers a re-fetch", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockClients))
      .mockResolvedValueOnce(makeResponse(mockClients));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useClientHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.reloader();
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("fetchClientById calls the correct URL and populates client state", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockClients))
      .mockResolvedValueOnce(makeResponse(mockClient));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useClientHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.fetchClientById(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/client/1",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
    expect(result.current.client).toEqual(mockClient);
  });

  it("fetchClientById sets error state when fetch returns 500", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockClients))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useClientHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.fetchClientById(99);
    });

    expect(result.current.error).toBe("Something went wrong, please try again.");
    expect(result.current.client).toBeNull();
  });
});
