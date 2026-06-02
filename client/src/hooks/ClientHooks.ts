import { useCallback, useState } from "react";
import type { Client } from "../types/Client";
import { useAuth } from "../context/AuthContext";


const API_BASE = import.meta.env.API_BASE ?? "http://localhost:8080";

interface ClientHookState {
  clients: Client[] | null;
  client: Client | null;
  loading: boolean;
  error: string | null;
}

const useClientHooks = () => {
  const [state, setState] = useState<ClientHookState>({
    clients: null,
    client: null,
    loading: false,
    error: null,
  });

  const { user } = useAuth();

  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  };

  const fetchAllClients = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch(`${API_BASE}/client/all/${user.id}`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message ?? `Request failed with status ${res.status}`);
      }

      const data = (await res.json()) as Client[];

      setState((prev) => ({ ...prev, clients: data }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch clients";
      setState((prev) => ({ ...prev, clients: null, error: message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [user.id, user.token]);

  const fetchClientById = useCallback(async (id: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch(`${API_BASE}/clients/${id}`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message ?? `Request failed with status ${res.status}`);
      }

      const data = (await res.json()) as Client;

      setState((prev) => ({ ...prev, client: data }));
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch client";
      setState((prev) => ({ ...prev, client: null, error: message }));
      return null;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [user.token]);

  return {
    clients: state.clients,
    client: state.client,
    loading: state.loading,
    error: state.error,
    fetchAllClients,
    fetchClientById,
  };
};

export { useClientHooks };