import { useState, useEffect } from "react";
import type { Workout, CreateWorkoutPayload } from "../types/Workout";
import { useApi } from "./useApi";
import { USE_MOCKS, mockWorkouts, mockExercises } from "../mocks";

export type WorkoutExercisePayload = {
  exerciseId: number;
  exerciseOrder: number;
  sets: WorkoutExerciseSetPayload[];
};

export type WorkoutExerciseSetPayload = {
  setOrder: number;
  defaultReps: number;
  defaultWeight: number | null;
};

const useWorkoutHooks = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reload, setReload] = useState(false);
  const { apiBase, authHeaders, GENERIC_ERROR } = useApi();

  const reloader = () => setReload((prev) => !prev);

  const fetchWorkouts = async () => {
    if (USE_MOCKS) {
      setWorkouts([...mockWorkouts]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/workouts/all`, {
        headers: authHeaders,
      });
      if (res.ok) setWorkouts(await res.json());
    } catch {
      return { error: GENERIC_ERROR };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [reload]);

  const handleCreateWorkout = async (
    payload: CreateWorkoutPayload
  ): Promise<{ workoutId?: number; error?: string }> => {
    if (USE_MOCKS) {
      const workoutId = Math.max(0, ...mockWorkouts.map((w) => w.workoutId)) + 1;
      const now = new Date().toISOString();
      mockWorkouts.push({
        ...payload,
        estimatedDuration: payload.estimatedDuration ?? 0,
        workoutId,
        trainerId: 1,
        exercises: [],
        createdAt: now,
        updatedAt: now,
      });
      reloader();
      return { workoutId };
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/workouts/create`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const { workoutId } = await res.json();
        reloader();
        return { workoutId };
      }
      return { error: GENERIC_ERROR };
    } catch {
      return { error: GENERIC_ERROR };
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditWorkout = async (
    id: number,
    payload: CreateWorkoutPayload
  ): Promise<{ error?: string }> => {
    if (USE_MOCKS) {
      const workout = mockWorkouts.find((w) => w.workoutId === id);
      if (workout) {
        Object.assign(workout, payload, {
          estimatedDuration: payload.estimatedDuration ?? workout.estimatedDuration,
          updatedAt: new Date().toISOString(),
        });
      }
      reloader();
      return {};
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/workouts/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        reloader();
        return {};
      }
      return { error: GENERIC_ERROR };
    } catch {
      return { error: GENERIC_ERROR };
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWorkout = async (
    id: number
  ): Promise<{ error?: string }> => {
    if (USE_MOCKS) {
      const index = mockWorkouts.findIndex((w) => w.workoutId === id);
      if (index !== -1) mockWorkouts.splice(index, 1);
      reloader();
      return {};
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/workouts/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (res.ok) {
        reloader();
        return {};
      }
      return { error: GENERIC_ERROR };
    } catch {
      return { error: GENERIC_ERROR };
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetWorkoutById = async (id: string): Promise<Workout | null> => {
    if (USE_MOCKS) {
      return mockWorkouts.find((w) => w.workoutId === Number(id)) ?? null;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/workouts/${id}`, {
        headers: authHeaders,
      });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkoutExercises = async (
    id: string,
    exercises: WorkoutExercisePayload[]
  ): Promise<{ error?: string }> => {
    if (!id) return { error: "No workout ID" };
    if (USE_MOCKS) {
      const workout = mockWorkouts.find((w) => w.workoutId === Number(id));
      if (!workout) return { error: "Workout not found" };
      let nextSetId = 1;
      workout.exercises = exercises.map((ex, i) => {
        const exercise = mockExercises.find((e) => e.exerciseId === ex.exerciseId);
        return {
          workoutExerciseId: i + 1,
          exerciseOrder: ex.exerciseOrder,
          exerciseId: ex.exerciseId,
          exerciseName: exercise?.name ?? "Unknown exercise",
          muscleGroup: exercise?.muscleGroup ?? "CORE",
          equipmentType: exercise?.equipmentType ?? "BODY_WEIGHT",
          category: exercise?.category ?? "STRENGTH",
          sets: ex.sets.map((set) => ({ ...set, setId: nextSetId++ })),
        };
      });
      return {};
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/workouts/${id}/exercises`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(exercises),
      });
      if (res.ok) return {};
      return { error: GENERIC_ERROR };
    } catch {
      return { error: GENERIC_ERROR };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    workouts,
    reload,
    reloader,
    handleSaveWorkoutExercises,
    handleGetWorkoutById,
    handleCreateWorkout,
    handleEditWorkout,
    handleDeleteWorkout,
  };
};

export { useWorkoutHooks };
