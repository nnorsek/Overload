// src/hooks/useAsyncState.ts
import { useState, useCallback } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface AsyncState<T> {
  data: T | null;
  status: Status;
  error: string | null;
}

export function useAsyncState<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: "idle",
    error: null,
  });

  const run = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, status: "loading", error: null });
    try {
      const data = await promise;
      setState({ data, status: "success", error: null });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ data: null, status: "error", error: message });
      throw err;
    }
  }, []);

  return {
    ...state,
    isLoading: state.status === "loading",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    run,
  };
}
