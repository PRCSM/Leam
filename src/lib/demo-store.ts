"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store for DEMO MODE state (chat messages, joined
 * universes, dashboard settings, demo session). Nothing here touches a server
 * or a payment provider.
 */
const PREFIX = "leam-demo:";
const listeners = new Set<() => void>();

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / sandbox) — state stays in memory */
  }
  listeners.forEach((l) => l());
}

export function useDemoState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read(key, initial));
    setHydrated(true);
    const sync = () => setValue(read(key, initial));
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated] as const;
}

export type DemoSession = { name: string; email: string; role: "creator" | "fan" } | null;

export function useDemoSession() {
  return useDemoState<DemoSession>("session", null);
}

/** True once mounted on the client — guards hydration-sensitive UI. */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
