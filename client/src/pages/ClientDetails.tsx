import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const ClientDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Hello {id}</h1>
    </div>
  );
};

export default ClientDetails;
