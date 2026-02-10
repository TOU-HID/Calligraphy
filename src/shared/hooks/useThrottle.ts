/**
 * useThrottle Hook
 *
 * Throttles a value to limit update frequency
 * Useful for gesture handlers and scroll events
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Throttle a value
 *
 * @param value - Value to throttle
 * @param interval - Minimum interval between updates in milliseconds
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(0);

  useEffect(() => {
    if (lastExecuted.current === 0) {
      lastExecuted.current = Date.now();
    }

    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now;
      const timerId = setTimeout(() => {
        setThrottledValue(value);
      }, 0);

      return () => {
        clearTimeout(timerId);
      };
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastExecution);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [value, interval]);

  return throttledValue;
}
