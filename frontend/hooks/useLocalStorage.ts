'use client';

import { useState, useCallback, useEffect } from 'react';

type SetValue<T> = T | ((prev: T) => T);

function getStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => getStorageValue(key, initialValue));

  useEffect(() => {
    setStoredValue(getStorageValue(key, initialValue));
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new StorageEvent('storage', { key }));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new StorageEvent('storage', { key }));
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
