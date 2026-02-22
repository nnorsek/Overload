import React from "react";
import MetricCard from "../components/MetricCard";

const Dashboard = () => {
  return (
    <div className="">
      <div className="px-5">
        <h1 className="text-3xl bold py-5 font-bold">Dashboard</h1>
        <p className="text-lg text-gray-500">
          Overview of all your clients and their progress
        </p>
        <div className="flex gap-x-2">
          <MetricCard title="# of Clients" primary_data={5} metric_data={10} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
