import { renderHook, act, waitFor } from "@testing-library/react";
import { useWorkoutHooks } from "../WorkoutHooks";
import type { WorkoutExercisePayload } from "../WorkoutHooks";

vi.mock("../useApi", () => ({
  useApi: () => ({
    apiBase: "http://localhost:8080",
    authHeaders: { "Content-Type": "application/json" },
    user: { id: 1, token: "test-token" },
    GENERIC_ERROR: "Something went wrong, please try again.",
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

const mockWorkouts = [
  {
    workoutId: 1,
    trainerId: 10,
    name: "Full Body Blast",
    description: "A full body workout",
    difficultyLevel: "INTERMEDIATE",
    estimatedDuration: 60,
    exercises: [],
    createdAt: "2026-01-01T00:00:00",
    updatedAt: "2026-01-01T00:00:00",
  },
];

const mockWorkout = mockWorkouts[0];

const createPayload = {
  name: "New Workout",
  description: "desc",
  difficultyLevel: "BEGINNER" as const,
  estimatedDuration: 45,
};

const exercisePayload: WorkoutExercisePayload[] = [
  {
    exerciseId: 5,
    exerciseOrder: 1,
    sets: [{ setOrder: 1, defaultReps: 10, defaultWeight: 50 }],
  },
];

describe("useWorkoutHooks", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(mockWorkouts)));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches workouts on mount", async () => {
    const { result } = renderHook(() => useWorkoutHooks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.workouts).toEqual(mockWorkouts);
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      "http://localhost:8080/workouts/all",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
  });

  it("handleCreateWorkout POSTs to /workouts/create and returns workoutId", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse({ workoutId: 42 }))
      .mockResolvedValueOnce(makeResponse(mockWorkouts));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { workoutId?: number; error?: string } = {};
    await act(async () => {
      response = await result.current.handleCreateWorkout(createPayload);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/workouts/create",
      expect.objectContaining({ method: "POST", body: JSON.stringify(createPayload) })
    );
    expect(response.workoutId).toBe(42);
    expect(response.error).toBeUndefined();
  });

  it("handleCreateWorkout triggers reload after success", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse({ workoutId: 42 }))
      .mockResolvedValueOnce(makeResponse(mockWorkouts));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleCreateWorkout(createPayload);
    });

    // mount fetch + reload fetch = 3 total (mock provides 3)
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("handleCreateWorkout returns error on failed response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { workoutId?: number; error?: string } = {};
    await act(async () => {
      response = await result.current.handleCreateWorkout(createPayload);
    });

    expect(response.error).toBe("Something went wrong, please try again.");
    expect(response.workoutId).toBeUndefined();
  });

  it("handleCreateWorkout returns error on fetch exception", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockRejectedValueOnce(new Error("Network error"));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { workoutId?: number; error?: string } = {};
    await act(async () => {
      response = await result.current.handleCreateWorkout(createPayload);
    });

    expect(response.error).toBe("Something went wrong, please try again.");
  });

  it("handleEditWorkout PUTs to /workouts/:id and triggers reload", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockWorkouts));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleEditWorkout(1, createPayload);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/workouts/1",
      expect.objectContaining({ method: "PUT", body: JSON.stringify(createPayload) })
    );
    expect(response.error).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("handleEditWorkout returns error on failed response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleEditWorkout(1, createPayload);
    });

    expect(response.error).toBe("Something went wrong, please try again.");
  });

  it("handleDeleteWorkout DELETEs /workouts/:id and triggers reload", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null))
      .mockResolvedValueOnce(makeResponse(mockWorkouts));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleDeleteWorkout(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/workouts/1",
      expect.objectContaining({ method: "DELETE" })
    );
    expect(response.error).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("handleDeleteWorkout returns error on failed response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleDeleteWorkout(1);
    });

    expect(response.error).toBe("Something went wrong, please try again.");
  });

  it("handleGetWorkoutById GETs /workouts/:id and returns workout", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(mockWorkout));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let workout: typeof mockWorkout | null = null;
    await act(async () => {
      workout = await result.current.handleGetWorkoutById("1");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/workouts/1",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
    expect(workout).toEqual(mockWorkout);
  });

  it("handleGetWorkoutById returns null on failed response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let workout: unknown = "sentinel";
    await act(async () => {
      workout = await result.current.handleGetWorkoutById("99");
    });

    expect(workout).toBeNull();
  });

  it("handleGetWorkoutById returns null on fetch exception", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockRejectedValueOnce(new Error("Network error"));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let workout: unknown = "sentinel";
    await act(async () => {
      workout = await result.current.handleGetWorkoutById("1");
    });

    expect(workout).toBeNull();
  });

  it("handleSaveWorkoutExercises PUTs exercises to /workouts/:id/exercises", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleSaveWorkoutExercises("1", exercisePayload);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/workouts/1/exercises",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(exercisePayload),
      })
    );
    expect(response.error).toBeUndefined();
  });

  it("handleSaveWorkoutExercises returns error when id is empty string", async () => {
    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleSaveWorkoutExercises("", exercisePayload);
    });

    expect(response.error).toBe("No workout ID");
  });

  it("handleSaveWorkoutExercises returns error on failed response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockResolvedValueOnce(makeResponse(null, false));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleSaveWorkoutExercises("1", exercisePayload);
    });

    expect(response.error).toBe("Something went wrong, please try again.");
  });

  it("handleSaveWorkoutExercises returns error on fetch exception", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(mockWorkouts))
      .mockRejectedValueOnce(new Error("Network error"));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWorkoutHooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error?: string } = {};
    await act(async () => {
      response = await result.current.handleSaveWorkoutExercises("1", exercisePayload);
    });

    expect(response.error).toBe("Something went wrong, please try again.");
  });
});
