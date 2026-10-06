import { useState, useEffect } from "react";
import type { Exercise, CreateExercisePayload } from "../types/Exercise";
import { useApi } from "./useApi";
import { USE_MOCKS, mockExercises } from "../mocks";

const useExerciseHooks = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reload, setReload] = useState(false);
  const { apiBase, authHeaders, GENERIC_ERROR } = useApi();

  const reloader = () => setReload((prev) => !prev);

  const fetchExercises = async () => {
    if (USE_MOCKS) {
      setExercises([...mockExercises]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/exercises/all`, { headers: authHeaders });
      if (res.ok) setExercises(await res.json());
    } catch {
      // network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [reload]);

  const handleEditExercise = async (
    id: number,
    payload: Partial<Exercise>
  ): Promise<{ error?: string }> => {
    if (USE_MOCKS) {
      const exercise = mockExercises.find((e) => e.exerciseId === id);
      if (exercise) Object.assign(exercise, payload);
      reloader();
      return {};
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/exercises/${id}`, {
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

  const handleDeleteExercise = async (id: number): Promise<{ error?: string }> => {
    if (USE_MOCKS) {
      const index = mockExercises.findIndex((e) => e.exerciseId === id);
      if (index !== -1) mockExercises.splice(index, 1);
      reloader();
      return {};
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/exercises/${id}`, {
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

  const handleCreateExercise = async (
    payload: CreateExercisePayload
  ): Promise<{ error?: string }> => {
    if (USE_MOCKS) {
      mockExercises.push({
        ...payload,
        equipmentType: payload.equipmentType as Exercise["equipmentType"],
        exerciseId: Math.max(0, ...mockExercises.map((e) => e.exerciseId)) + 1,
        trainerId: 1,
        originalExerciseId: null,
      });
      reloader();
      return {};
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/exercises/create`, {
        method: "POST",
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

  return {
    loading,
    submitting,
    exercises,
    reload,
    reloader,
    handleEditExercise,
    handleDeleteExercise,
    handleCreateExercise,
  };
};

export { useExerciseHooks };
