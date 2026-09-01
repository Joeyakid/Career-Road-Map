"use client";

import { useCallback, useState } from "react";
import { readStoredValue, writeStoredValue } from "@/lib/storage";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback));
  const updateValue = useCallback((next: T | ((current: T) => T)) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? (next as (current: T) => T)(current) : next;
      writeStoredValue(key, resolved);
      return resolved;
    });
  }, [key]);
  return [value, updateValue] as const;
}
