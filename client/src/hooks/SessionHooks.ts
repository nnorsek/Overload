import type { ServerSession, Session, SessionStatus } from "@/types/Session";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { useAsyncState } from "./useAsyncState";
import { USE_MOCKS, mockClients, mockSessions } from "../mocks";

const STATUS_LABELS: Record<ServerSession["status"], SessionStatus> = {
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  COMPLETED: "Completed",
};

const minutesBetween = (start: string, end: string) =>
  Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);

const toSession = (s: ServerSession): Session => ({
  id: s.sessionId,
  clients: s.clients,
  duration: minutesBetween(s.scheduledStart, s.scheduledEnd),
  sessionDate: s.scheduledStart,
  status: STATUS_LABELS[s.status],
});

const toMockSession = (id: number, payload: CreateSessionPayload): Session => ({
  id,
  clients: mockClients
    .filter((c) => payload.clientIds.includes(c.clientId))
    .map(({ clientId, firstName, lastName }) => ({ clientId, firstName, lastName })),
  duration: minutesBetween(payload.scheduledStart, payload.scheduledEnd),
  sessionDate: payload.scheduledStart,
  status: "Pending",
});

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
    if (USE_MOCKS) {
      listState.run(Promise.resolve([...mockSessions]));
      return;
    }
    listState.run(
      (async () => {
        const res = await fetch(`${apiBase}/trainer/sessions`, {
          headers: authHeaders,
        });
        await throwIfNotOK(res);
        const sessions: ServerSession[] = await res.json();
        return sessions.map(toSession);
      })()
    ).catch(() => {});
  }, [reload]);

  const createSession = async (payload: CreateSessionPayload) => {
    if (USE_MOCKS) {
      const id = Math.max(0, ...mockSessions.map((s) => s.id)) + 1;
      mockSessions.push(toMockSession(id, payload));
      reloader();
      return;
    }
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
    if (USE_MOCKS) {
      const index = mockSessions.findIndex((s) => s.id === id);
      if (index !== -1) {
        mockSessions[index] = { ...toMockSession(id, payload), status: mockSessions[index].status };
      }
      reloader();
      return;
    }
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
    if (USE_MOCKS) {
      const index = mockSessions.findIndex((s) => s.id === id);
      if (index !== -1) mockSessions.splice(index, 1);
      reloader();
      return;
    }
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
    if (USE_MOCKS) {
      const session = mockSessions.find((s) => s.id === sessionId);
      const client = mockClients.find((c) => c.clientId === clientId);
      if (session && client && !session.clients.some((c) => c.clientId === clientId)) {
        session.clients.push({ clientId, firstName: client.firstName, lastName: client.lastName });
      }
      reloader();
      return;
    }
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
    if (USE_MOCKS) {
      const session = mockSessions.find((s) => s.id === sessionId);
      if (session) session.clients = session.clients.filter((c) => c.clientId !== clientId);
      reloader();
      return;
    }
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
