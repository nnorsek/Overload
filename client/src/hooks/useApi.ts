import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.API_BASE ?? "http://localhost:8080";
const GENERIC_ERROR = "Something went wrong, please try again.";

const useApi = () => {
  const { user } = useAuth();

  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  };

  const throwIfNotOK = async (res: Response): Promise<void> => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? body.error ?? res.statusText);
    }
  };

  return { apiBase: API_BASE, authHeaders, user, GENERIC_ERROR, throwIfNotOK };
};

export { useApi };
