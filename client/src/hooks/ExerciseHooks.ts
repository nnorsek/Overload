import { useState, useEffect } from "react";
import type { Exercise, CreateExercisePayload } from "../types/Exercise";
import { useApi } from "./useApi";

const useExerciseHooks = () => {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reload, setReload] = useState(false);
    const { apiBase, authHeaders, GENERIC_ERROR } = useApi();

    const reloader = () => setReload((prev) => !prev);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/exercises/all`, {
                headers: authHeaders,
            })
            if (res.ok) {
                setExercises(await res.json());
            } else if (res.status === 500) {
                setError(GENERIC_ERROR)
            }
        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false);
        }
    }

    const handleEditExercise = async (id: number, payload: Partial<Exercise>) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/exercises/${id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response.status === 500) {
                setError(GENERIC_ERROR)
            } else {
                setError(error.response)
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchExercises();
    }, [reload])

    const handleDeleteExercise = async (id: number) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/exercises/${id}`, {
                method: "DELETE",
                headers: authHeaders,
            })
            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response.status === 500) {
                setError(GENERIC_ERROR)
            } else {
                setError(error.response);
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCreateExercise = async (payload: CreateExercisePayload) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/exercises/create`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response.status === 500) {
                setError(GENERIC_ERROR)
            } else {
                setError(error.response);
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, exercises, error, reload, reloader, handleEditExercise, handleDeleteExercise, handleCreateExercise }
}

export { useExerciseHooks }
