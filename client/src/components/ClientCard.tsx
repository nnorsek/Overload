import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendDown,
  faPlus,
  faArrowTrendUp,
  faChevronRight,
  faMinus,
  faFireFlameSimple,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../utils/time.utils";
import type { Client } from "../types/Client";

type ClientCardProps = {
  client: Client;
};

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  // Change to API Pull for Client Information
  const showInKg = false;
  const numberOfWorkouts = 2;
  const streak = 2;
  const weightChange = client.current_weight - client.starting_weight;
  const displayWeightChange = () => {
    if (weightChange > 0) {
      return (
        <>
          <FontAwesomeIcon icon={faPlus} size="xs" /> {weightChange}{" "}
          {weightDisplayMetric}
        </>
      );
    } else if (weightChange < 0) {
      return (
        <>
          <FontAwesomeIcon icon={faMinus} size="xs" /> {Math.abs(weightChange)}{" "}
          {weightDisplayMetric}
        </>
      );
    } else {
      return 0;
    }
  };

  const weightDisplayMetric = showInKg ? "kg" : "lbs";

  return (
    <div className="border rounded-xl border-gray-400/80 p-3 pl-5">
      <div className="flex justify-between">
        {/* <image/> */}
        <h3 className="font-semibold text-lg py-2">
          {client.first_name + " " + client.last_name}
        </h3>
        <button
          className="hover:bg-gray-200/90 hover:cursor-pointer rounded-lg px-2 py-1"
          onClick={() => console.log("button clicked")}
        >
          View Details <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Client since: {formatDate(client.started_at)}
      </p>
      <p className="text-sm text-gray-700 pt-2 font-semibold">{client.goal}</p>
      {/* Clients Display Stats */}
      <div className="flex gap-x-4 mt-2">
        <div className="bg-gray-300/80 rounded-lg p-2 w-full">
          <p className="pb-2 text-gray-600 text-sm">
            {weightChange > 0 ? (
              <FontAwesomeIcon icon={faArrowTrendUp} />
            ) : (
              <FontAwesomeIcon icon={faArrowTrendDown} />
            )}{" "}
            Weight Change
          </p>
          <p className="pl-5 font-semibold text-lg">{displayWeightChange()}</p>
        </div>
        <div className="bg-gray-300/80 rounded-lg p-2 w-full">
          <p className="pb-2 text-gray-600 text-sm">Current Weight</p>
          <p className="pl-2 font-semibold text-lg">
            {client.current_weight} {weightDisplayMetric}
          </p>
        </div>
        <div className="bg-gray-300/80 rounded-lg p-2 w-full">
          <p className="pb-2 text-gray-600 text-sm">
            Streak <FontAwesomeIcon icon={faFireFlameSimple} />
          </p>
          <p className="pl-2 font-semibold text-lg">{streak} days</p>
        </div>
        <div className="bg-gray-300/80 rounded-lg p-2 w-full">
          <p className="pb-2 text-gray-600 text-sm">This Week</p>
          <p className="pl-2 font-semibold text-lg">
            {numberOfWorkouts} workouts
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
