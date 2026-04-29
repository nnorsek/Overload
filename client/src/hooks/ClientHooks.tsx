import { useCallback, useState } from "react";
import type { Client } from "../types/Client";

const useClientHooks = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[] | null>(null);

  const fetchAllClients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/client/all");

      if (!res.ok) {
        throw new Error("request failed");
      }
      const data: Client[] = await res.json();

      setClients(data);
    } catch (err: any) {
      setError(err.message || "error");
      setClients(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // const fetchClientByID = useCallback(async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const res = await fetch("http://localhost:8080/clients/")
  //   }
  // })

  return { clients, fetchAllClients, error, loading };
};

export { useClientHooks };
