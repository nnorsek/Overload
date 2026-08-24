import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAsyncState } from "../useAsyncState";

describe("useAsyncState", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() => useAsyncState());

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("transitions to loading while promise is pending", async () => {
    const { result } = renderHook(() => useAsyncState<string>());
    let resolve!: (v: string) => void;
    const promise = new Promise<string>((r) => (resolve = r));

    act(() => { result.current.run(promise); });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();

    await act(async () => { resolve("done"); });
  });

  it("transitions to success with data", async () => {
    const { result } = renderHook(() => useAsyncState<string>());

    await act(async () => {
      await result.current.run(Promise.resolve("hello"));
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe("hello");
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("transitions to error with message on rejection", async () => {
    const { result } = renderHook(() => useAsyncState<string>());

    await act(async () => {
      try {
        await result.current.run(Promise.reject(new Error("oops")));
      } catch {}
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe("oops");
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("uses 'Unknown error' for non-Error rejections", async () => {
    const { result } = renderHook(() => useAsyncState<string>());

    await act(async () => {
      try {
        await result.current.run(Promise.reject("raw string error"));
      } catch {}
    });

    expect(result.current.error).toBe("Unknown error");
  });

  it("rethrows the error after setting state", async () => {
    const { result } = renderHook(() => useAsyncState<string>());

    await act(async () => {
      await expect(
        result.current.run(Promise.reject(new Error("thrown")))
      ).rejects.toThrow("thrown");
    });
  });

  it("resets data to null on a new run", async () => {
    const { result } = renderHook(() => useAsyncState<string>());

    await act(async () => {
      await result.current.run(Promise.resolve("first"));
    });
    expect(result.current.data).toBe("first");

    let resolve!: (v: string) => void;
    const promise = new Promise<string>((r) => (resolve = r));

    act(() => { result.current.run(promise); });

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);

    await act(async () => { resolve("second"); });
  });
});
