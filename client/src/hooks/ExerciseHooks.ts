import { useState, useEffect } from "react";
import type { Exercise } from "../types/Exercise"
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.API_BASE ?? "http://localhost:8080";



const useExerciseHooks = () => {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const authHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
    };

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

    useEffect(() => {
        fetchExercises();
    }, [])


    return { loading, exercises, error }
}

export {
    useExerciseHooks
}