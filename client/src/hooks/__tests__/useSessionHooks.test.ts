import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSessionHooks, type CreateSessionPayload } from "../SessionHooks";

vi.mock("../useApi", () => ({
  useApi: () => ({
    apiBase: "http://localhost:8080",
    authHeaders: { "Content-Type": "application/json" },
    throwIfNotOK: async (res: Response) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? res.statusText);
      }
    },
  }),
}));

// Shape returned by GET /trainer/sessions
const mockSessions = [
  {
    sessionId: 1,
    clients: [{ clientId: 1, firstName: "John", lastName: "Doe" }],
    scheduledStart: "2026-09-01T10:00:00",
    scheduledEnd: "2026-09-01T11:00:00",
    status: "CONFIRMED",
    notes: null,
  },
];

// The same session after the hook converts it for the UI
const expectedSessions = [
  {
    id: 1,
    clients: [{ clientId: 1, firstName: "John", lastName: "Doe" }],
    duration: 60,
    sessionDate: "2026-09-01T10:00:00",
    status: "Confirmed",
  },
];

function makeResponse(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 400,
    statusText: ok ? "OK" : "Bad Request",
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

const validPayload: CreateSessionPayload = {
  clientIds: [1],
  workoutId: 1,
  scheduledStart: "2027-09-01T10:00:00",
  scheduledEnd: "2027-09-01T11:00:00",
};

describe("useSessionHooks", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(mockSessions)));
  });

  it("fetches sessions on mount from /trainer/sessions", async () => {
    const { result } = renderHook(() => useSessionHooks());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/trainer/sessions",
      expect.anything()
    );
    expect(result.current.sessions).toEqual(expectedSessions);
    expect(result.current.listError).toBeNull();
  });

  it("converts each server status to its display label", async () => {
    const statuses = ["CONFIRMED", "PENDING", "CANCELLED", "COMPLETED"];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeResponse(statuses.map((status, i) => ({ ...mockSessions[0], sessionId: i, status })))
      )
    );

    const { result } = renderHook(() => useSessionHooks());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.sessions.map((s) => s.status)).toEqual([
      "Confirmed",
      "Pending",
      "Cancelled",
      "Completed",
    ]);
  });

  it("sets listError on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeResponse({ message: "Unauthorized" }, false))
    );

    const { result } = renderHook(() => useSessionHooks());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.listError).toBe("Unauthorized");
    expect(result.current.sessions).toEqual([]);
  });

  it("createSession calls POST /sessions and reloads", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(makeResponse(mockSessions))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockSessions));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useSessionHooks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.createSession(validPayload);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/sessions",
      expect.objectContaining({ method: "POST" })
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("editSession calls PUT /sessions/:id and reloads", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(makeResponse(mockSessions))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockSessions));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useSessionHooks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.editSession(1, validPayload);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/sessions/1",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("deleteSession calls DELETE /sessions/:id and reloads", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(makeResponse(mockSessions))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockSessions));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useSessionHooks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteSession(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/sessions/1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("addClientToSession calls POST /sessions/:id/clients and reloads", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(makeResponse(mockSessions))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockSessions));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useSessionHooks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addClientToSession(1, 2);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/sessions/1/clients",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("removeClientFromSession calls DELETE /sessions/:id/clients/:clientId and reloads", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(makeResponse(mockSessions))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockSessions));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useSessionHooks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.removeClientFromSession(1, 2);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/sessions/1/clients/2",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("sets mutationError when a mutation fails", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(makeResponse(mockSessions))
      .mockResolvedValueOnce(makeResponse({ message: "Session not found" }, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useSessionHooks());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      try {
        await result.current.deleteSession(99);
      } catch {}
    });

    expect(result.current.mutationError).toBe("Session not found");
  });
});
