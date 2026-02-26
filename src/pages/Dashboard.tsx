import React from "react";
import ClientCard from "../components/ClientCard";
import SessionsCard from "../components/SessionsCard";
import { exampleClients, exampleSession } from "../mock_data";
import type { ClientInfo } from "../types/Client";
import type { Session } from "../types/Session";

const Dashboard = () => {
  // Pull All Session Information

  // Pull All Client Information

  return (
    <div className="">
      <div className="px-5">
        <h1 className="text-3xl bold py-5 font-bold">Dashboard</h1>
        <p className="text-lg text-gray-500">
          Overview of all your clients and their progress
        </p>
        <h2 className="text-2xl my-2 mt-10 font-semibold">Clients</h2>
        <p className="text-gray-500">View Client Details and History</p>
        <div className="mt-5">
          <div className="flex gap-x-20">
            {/* Clients Section */}
            <div className="flex flex-col gap-y-5 flex-2">
              {exampleClients.map((client: ClientInfo) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
            <div className="border border-gray-400/80 rounded-lg p-5 flex-1">
              <h1 className="pb-5 font-semibold text-lg">Today's Sessions</h1>
              <div className="flex flex-col gap-y-5">
                {exampleSession.map((session: Session) => (
                  <SessionsCard session={session} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
