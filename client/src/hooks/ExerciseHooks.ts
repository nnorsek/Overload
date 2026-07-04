import { useState, useEffect } from "react";
import type { Exercise, CreateExercisePayload } from "../types/Exercise";
import { useApi } from "./useApi";

const useExerciseHooks = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reload, setReload] = useState(false);
  const { apiBase, authHeaders, GENERIC_ERROR } = useApi();

  const reloader = () => setReload((prev) => !prev);

  const fetchExercises = async () => {
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
