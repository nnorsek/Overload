import { renderHook, act, waitFor } from "@testing-library/react";
import { useExerciseHooks } from "../ExerciseHooks";

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
    status: ok ? 200 : 400,
    statusText: ok ? "OK" : "Bad Request",
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

const mockExercises = [
  {
    exerciseId: 1,
    name: "Bench Press",
    equipmentType: "BARBELL",
    muscleGroup: "CHEST",
    description: "Classic chest press",
    category: "STRENGTH",
    trainerId: null,
    originalExerciseId: null,
  },
  {
    exerciseId: 2,
    name: "Pull Up",
    equipmentType: "BODY_WEIGHT",
    muscleGroup: "BACK",
    description: "Upper body pull",
    category: "STRENGTH",
    trainerId: null,
    originalExerciseId: null,
  },
];

const createPayload = {
  name: "Squat",
  description: "Leg day staple",
  category: "STRENGTH" as const,
  equipmentType: "BARBELL",
  muscleGroup: "LEGS" as const,
};

describe("useExerciseHooks", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(mockExercises)));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches exercises on mount with the correct URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(mockExercises));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/exercises/all",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
    expect(result.current.exercises).toEqual(mockExercises);
  });

  it("handleCreateExercise calls POST /exercises/create and triggers reload", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockExercises))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockExercises));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returnValue: { error?: string } | undefined;
    await act(async () => {
      returnValue = await result.current.handleCreateExercise(createPayload);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/exercises/create",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(createPayload),
      })
    );
    expect(returnValue).toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("handleEditExercise calls PUT /exercises/:id and triggers reload", async () => {
    const editPayload = { name: "Bench Press Updated", description: "Updated description" };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockExercises))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockExercises));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returnValue: { error?: string } | undefined;
    await act(async () => {
      returnValue = await result.current.handleEditExercise(1, editPayload);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/exercises/1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(editPayload),
      })
    );
    expect(returnValue).toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("handleDeleteExercise calls DELETE /exercises/:id and triggers reload", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockExercises))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockExercises));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returnValue: { error?: string } | undefined;
    await act(async () => {
      returnValue = await result.current.handleDeleteExercise(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/exercises/1",
      expect.objectContaining({ method: "DELETE" })
    );
    expect(returnValue).toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("handleCreateExercise returns error object on non-ok response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockExercises))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returnValue: { error?: string } | undefined;
    await act(async () => {
      returnValue = await result.current.handleCreateExercise(createPayload);
    });

    expect(returnValue).toEqual({ error: "Something went wrong, please try again." });
  });

  it("handleEditExercise returns error object on non-ok response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockExercises))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returnValue: { error?: string } | undefined;
    await act(async () => {
      returnValue = await result.current.handleEditExercise(1, { name: "Updated" });
    });

    expect(returnValue).toEqual({ error: "Something went wrong, please try again." });
  });

  it("handleDeleteExercise returns error object on non-ok response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockExercises))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returnValue: { error?: string } | undefined;
    await act(async () => {
      returnValue = await result.current.handleDeleteExercise(99);
    });

    expect(returnValue).toEqual({ error: "Something went wrong, please try again." });
  });

  it("sets submitting to false after mutations complete", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockExercises))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockExercises));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useExerciseHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleDeleteExercise(1);
    });

    expect(result.current.submitting).toBe(false);
  });
});
