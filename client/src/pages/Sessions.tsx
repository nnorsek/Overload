import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import Wrapper from "@/components/Wrapper";
import { useSessionHooks } from "@/hooks/SessionHooks";

export default function Sessions() {
  const {
    sessions,
    isLoading,
    isSubmitting,
    listError,
    mutationError,
    createSession,
    editSession,
    deleteSession,
    addClientToSession,
    removeClientFromSession,
    reloader,
  } = useSessionHooks();

  return (
    <Wrapper>
      <h1 className="text-xl bold py-5 font-bold">Sessions</h1>
      <Card>
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              {session.clients
                .map((client) => `${client.firstName} ${client.lastName}`)
                .join(", ")}
            </li>
          ))}
        </ul>
      </Card>
    </Wrapper>
  );
}
