import type { Session } from "@/types/Session";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { useAsyncState } from "./useAsyncState";

export type CreateSessionPayload = {
  clientIds: number[];
  workoutId: number;
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
};

export function useSessionHooks() {
  const { apiBase, authHeaders, throwIfNotOK } = useApi();
  const listState = useAsyncState<Session[]>();
  const mutationState = useAsyncState<void>();
  const [reload, setReload] = useState(false);

  const reloader = () => setReload((prev) => !prev);

  useEffect(() => {
    listState.run(
      (async () => {
        const res = await fetch(`${apiBase}/sessions/all`, {
          headers: authHeaders,
        });
        await throwIfNotOK(res);
        return res.json();
      })()
    ).catch(() => {});
  }, [reload]);

  const createSession = async (payload: CreateSessionPayload) => {
    await mutationState.run(
      (async () => {
        const res = await fetch(`${apiBase}/sessions`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        await throwIfNotOK(res);
      })()
    );
    reloader();
  };

  const editSession = async (id: number, payload: CreateSessionPayload) => {
    await mutationState.run(
      (async () => {
        const res = await fetch(`${apiBase}/sessions/${id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        await throwIfNotOK(res);
      })()
    );
    reloader();
  };

  const deleteSession = async (id: number) => {
    await mutationState.run(
      (async () => {
        const res = await fetch(`${apiBase}/sessions/${id}`, {
          method: "DELETE",
          headers: authHeaders,
        });
        await throwIfNotOK(res);
      })()
    );
    reloader();
  };

  const addClientToSession = async (sessionId: number, clientId: number) => {
    await mutationState.run(
      (async () => {
        const res = await fetch(`${apiBase}/sessions/${sessionId}/clients`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ clientId }),
        });
        await throwIfNotOK(res);
      })()
    );
    reloader();
  };

  const removeClientFromSession = async (sessionId: number, clientId: number) => {
    await mutationState.run(
      (async () => {
        const res = await fetch(
          `${apiBase}/sessions/${sessionId}/clients/${clientId}`,
          { method: "DELETE", headers: authHeaders }
        );
        await throwIfNotOK(res);
      })()
    );
    reloader();
  };

  return {
    sessions: listState.data ?? [],
    isLoading: listState.isLoading,
    isSubmitting: mutationState.isLoading,
    listError: listState.error,
    mutationError: mutationState.error,
    createSession,
    editSession,
    deleteSession,
    addClientToSession,
    removeClientFromSession,
    reloader,
  };
}
