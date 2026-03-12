import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import img from "../../profile_pic.jpeg";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faChevronRight,
  faFireFlameSimple,
} from "@fortawesome/free-solid-svg-icons";
import type { Client } from "../types/Client";
import { useNavigate } from "react-router-dom";

type ClientCardProps = {
  client: Client;
};

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const navigate = useNavigate();
  const showInKg = false;
  const numberOfWorkouts = 2;
  const streak = 2;
  const weightChange = client.current_weight - client.starting_weight;

  const weightDisplayMetric = showInKg ? "kg" : "lbs";

  return (
    <div className="border rounded-xl border-gray-400/80 p-3 pl-5">
      <div className="flex items-center">
        <img
          src={img}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        {/* LEFT CONTENT */}
        <div className="flex flex-col pl-2">
          {/* TOP ROW */}
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">
              {client.first_name + " " + client.last_name}
            </h3>

            <div className="flex items-center gap-1 text-sm">
              <FontAwesomeIcon
                icon={faFireFlameSimple}
                className="text-gray-600"
              />
              <span>{streak}</span>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex items-center gap-4 text-sm text-gray-700 pt-2">
            {/* weight change */}
            <span className="flex items-center gap-1">
              {weightChange > 0 ? (
                <FontAwesomeIcon icon={faArrowTrendUp} />
              ) : (
                <FontAwesomeIcon icon={faArrowTrendDown} />
              )}
            </span>

            <span className="text-gray-400">•</span>

            {/* current weight */}
            <span>
              {client.current_weight} {weightDisplayMetric}
            </span>

            <span className="text-gray-400">•</span>

            {/* workouts */}
            <span>{numberOfWorkouts} workouts this week</span>
          </div>
        </div>

        {/* RIGHT BUTTON */}
        <button
          className="ml-auto hover:bg-gray-200/90 rounded-lg px-2 py-1"
          onClick={() => navigate(`/clients/details/${client.client_id}`)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
