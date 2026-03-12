import { useState } from "react";
import ClientCard from "../components/ClientCard";
import SessionsCard from "../components/SessionsCard";
import { exampleSession } from "../../mock_data";
import type { Client } from "../types/Client";
import type { Session } from "../types/Session";
import { useClientHooks } from "../hooks/ClientHooks";

const Dashboard = () => {
  const { clients, refresh, error, loading } = useClientHooks();

  return (
    <div className="">
      <div className="px-5">
        <h1 className="text-3xl bold py-5 font-bold">Dashboard</h1>
        <p className="text-gray-500 pt-2">
          Placeholder description tag Placeholder description tag Placeholder
          description tag Placeholder description tag
        </p>
        <div className="mt-5">
          <div className="flex gap-x-20">
            {/* Clients Section */}
            {!clients || clients.length === 0 ? (
              <div className="">No clients</div>
            ) : (
              <>
                <div className="flex flex-col gap-y-5 flex-2">
                  <h1 className="font-semibold text-3xl">Clients</h1>
                  <p className="text-gray-500">
                    View Client Details and History
                  </p>
                  {clients.map((client: Client) => (
                    <ClientCard key={client.client_id} client={client} />
                  ))}
                </div>
                <div className="flex-1 flex flex-col gap-y-5">
                  <h1 className="font-semibold text-3xl">Sessions</h1>
                  <p className="text-gray-500">View Today's Sessions</p>
                  <div className="flex flex-col gap-y-5">
                    {exampleSession.map((session: Session, idx: number) => (
                      <SessionsCard key={idx} session={session} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
