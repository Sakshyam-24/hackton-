'use client';

import { useEffect, useCallback, useRef } from 'react';

interface KeyBinding {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyboard(bindings: KeyBinding[], deps: unknown[] = []) {
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const binding of bindingsRef.current) {
        const keyMatch = e.key.toLowerCase() === binding.key.toLowerCase();
        const ctrlMatch = binding.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = binding.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = binding.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          binding.handler(e);
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useEscapeKey(handler: () => void) {
  useKeyboard([{ key: 'Escape', handler }], [handler]);
}

export function useEnterKey(handler: (e: KeyboardEvent) => void, enabled = true) {
  useKeyboard([{ key: 'Enter', handler }], [handler, enabled]);
}

export function useShortcuts(shortcuts: Record<string, () => void>) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey || e.metaKey ? 'ctrl' : '',
        e.shiftKey ? 'shift' : '',
        e.altKey ? 'alt' : '',
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+');

      if (shortcutsRef.current[key]) {
        e.preventDefault();
        shortcutsRef.current[key]();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}

export default useKeyboard;
