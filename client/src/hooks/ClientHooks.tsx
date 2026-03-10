import { useEffect, useState } from "react";
import type { Client } from "../types/Client";

const useClientHooks = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [clients, setClients] = useState<Client[] | null>(null);

  useEffect(() => {
    const fetchAllClients = async () => {
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
        setError("request failed");
        console.log(err);
        setClients(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAllClients();
  }, [refresh]);

  return { clients, refresh, error, loading };
};

export { useClientHooks };
