import { useCallback, useState } from "react";
import type { Client } from "../types/Client";
import { useAuth } from "../context/AuthContext"

const useClientHooks = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[] | null>(null);
  const { user } = useAuth();

  const fetchAllClients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/client/all/${user.id}`, {
        headers: { "Authorization": `Bearer ${user.token}` }
      });

      if (!res.ok) {
        throw new Error("request failed");
      }
      console.log(res)
      const data = await res.json() as Client[];

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
