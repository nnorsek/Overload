import React from "react";

interface MetricCardProps {
  title: string;
  primary_data: number;
  metric_data: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  primary_data,
  metric_data,
}) => {
  return (
    <div className="flex flex-col px-6 py-2 border rounded w-1/6">
      <h1 className="text-xl font-medium">{title}</h1>
      <p className="pt-4 text-lg font-semibold">{primary_data}</p>
      <p className="mt-2 text-gray-800">{metric_data}</p>
    </div>
  );
};

export default MetricCard;
