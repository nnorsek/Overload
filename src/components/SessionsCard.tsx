import React from "react";
import type { Session } from "../types/Session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";
import { formatTime } from "../utils/time.utils";
import { sessionColor } from "../utils/session.utils";
import { useNavigate } from "react-router-dom";

type SessionsCardProps = {
  session: Session;
};

const SessionsCard: React.FC<SessionsCardProps> = ({ session }) => {
  const navigate = useNavigate();

  return (
    <div
      className="border border-gray-400/80 p-4 rounded-lg hover:bg-gray-200/60 hover:cursor-pointer"
      onClick={() => navigate(`/session/${session.client.name}/${session.id}`)}
    >
      <div className="flex justify-between">
        <p className="font-semibold">{session.client.name}</p>
        <div
          className={`px-5 py-1 rounded-xl font-semibold ${sessionColor(session.status).base}`}
        >
          {session.status}
        </div>
      </div>
      <p className="text-sm text-gray-700">{session.type}</p>
      <div className="flex text-xs gap-x-2 text-gray-700 mt-1">
        <p>
          <FontAwesomeIcon icon={faClock} /> {formatTime(session.sessionDate)}
        </p>
        <p>
          <FontAwesomeIcon icon={faHourglassHalf} />
          {session.duration} min
        </p>
      </div>
    </div>
  );
};

export default SessionsCard;
