"use client";
import { useCallback, useSyncExternalStore } from "react";

const EVENT_NAME = "arcane-local-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function getServerSnapshot() {
  return null;
}

// Reads a localStorage value reactively, without the hydration flash/cascade
// that a useEffect + setState read would cause.
export function useLocalStorageItem(key: string): string | null {
  const getSnapshot = useCallback(() => localStorage.getItem(key), [key]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function writeLocalStorageItem(key: string, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(EVENT_NAME));
}
