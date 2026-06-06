import { useState, useEffect } from "react";
import type { Exercise } from "../types/Exercise"
import { useAuth } from "../context/AuthContext";
import type { CreateExercisePayload } from "../types/Exercise";

const API_BASE = import.meta.env.API_BASE ?? "http://localhost:8080";

const useExerciseHooks = () => {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [reload, setReload] = useState(false);

    const authHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
    };

    const reloader = () => setReload((prev) => !prev);

    const fetchExercises = async () => {
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/exercises/all`, {
                headers: authHeaders,
            })
            if (res.ok) {
                setExercises(await res.json());
            } else if (res.status === 500){
                setError("Something went wrong, please try again.")
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
            const res = await fetch(`${API_BASE}/exercises/${id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response.status === 500) {
                setError("Something went wrong, please try again.")
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
            const res = await fetch(`${API_BASE}/exercises/${id}`, {
                method: "DELETE",
                headers: authHeaders
            })

            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response.status === 500) {
                setError("Something went wrong, please try again.")
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
            const res = await fetch(`${API_BASE}/exercises/create`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response.status === 500) {
                setError("Something went wrong, please try again.")
            } else {
                setError(error.response);
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, exercises, error, reload, reloader, handleEditExercise, handleDeleteExercise, handleCreateExercise }
}

export {
    useExerciseHooks
}