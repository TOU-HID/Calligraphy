/**
 * usePrevious Hook
 *
 * Tracks the previous value of a variable
 * Useful for comparing current vs previous state
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Get the previous value
 *
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const [prevValue, setPrevValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    setPrevValue(ref.current);
    ref.current = value;
  }, [value]);

  return prevValue;
}
