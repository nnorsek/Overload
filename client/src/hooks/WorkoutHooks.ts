import { useState, useEffect } from "react";
import type { Workout, CreateWorkoutPayload } from "../types/Workout";
import { useApi } from "./useApi";

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
