import { useState, useEffect } from "react";
import type { Client } from "../types/Client";
import { useApi } from "./useApi";

const useClientHooks = () => {

    const [clients, setClients] = useState<Client[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reload, setReload] = useState(false);
    const { apiBase, authHeaders, user, GENERIC_ERROR } = useApi();

    const reloader = () => setReload((prev) => !prev);

    const fetchAllClients = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/client/all/${user?.id}`, {
                headers: authHeaders,
            });
            if (res.ok) {
                setClients(await res.json());
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
        fetchAllClients();
    }, [reload]);

    const fetchClientById = async (id: number) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/clients/${id}`, {
                headers: authHeaders,
            });
            if (res.ok) {
                setClient(await res.json());
            } else if (res.status === 500) {
                setError(GENERIC_ERROR);
            }
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, clients, client, error, reload, reloader, fetchClientById };
};

export { useClientHooks };
