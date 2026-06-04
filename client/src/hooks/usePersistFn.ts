import { useRef } from "react";

// NOTE: any[] is intentional here — this hook is a generic function persister
// that must accept any callback signature. Narrowing to unknown[] breaks
// callers that pass typed event handlers (e.g., React.CompositionEvent).
type noop = (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * usePersistFn instead of useCallback to reduce cognitive load
 */
export function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>(null);
  if (!persistFn.current) {
    persistFn.current = function (this: unknown, ...args) {
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return persistFn.current!;
}
