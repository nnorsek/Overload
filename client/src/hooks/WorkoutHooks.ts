import { useState, useEffect } from "react";
import type { Workout, WorkoutPayload } from "../types/Workout";
import { useApi } from "./useApi";

const useWorkoutHooks = () => {

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reload, setReload] = useState(false);
    const { apiBase, authHeaders, GENERIC_ERROR } = useApi();

    const reloader = () => setReload((prev) => !prev);

    const fetchWorkouts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/workouts/all`, {
                headers: authHeaders,
            });
            if (res.ok) {
                setWorkouts(await res.json());
            } else if (res.status === 500) {
                setError(GENERIC_ERROR);
            }
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, [reload]);

    const handleCreateWorkout = async (payload: WorkoutPayload) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/workouts/create`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response?.status === 500) {
                setError(GENERIC_ERROR);
            } else {
                setError(error.response);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditWorkout = async (id: number, payload: WorkoutPayload) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/workouts/${id}`, {
                method: "PUT",
                headers: authHeaders,
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response?.status === 500) {
                setError(GENERIC_ERROR);
            } else {
                setError(error.response);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteWorkout = async (id: number) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/workouts/${id}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (res.ok) {
                reloader();
            }
        } catch (error: any) {
            if (error.response?.status === 500) {
                setError(GENERIC_ERROR);
            } else {
                setError(error.response);
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, workouts, error, reload, reloader, handleCreateWorkout, handleEditWorkout, handleDeleteWorkout };
};

export { useWorkoutHooks };
