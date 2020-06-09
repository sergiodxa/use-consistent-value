import * as React from 'react';
import fastDeepEqual from 'fast-deep-equal';

// If running server-side we use useEffect, client-side we use useLayoutEffect
// This is used to avoid the warning when doing SSR and using useLayoutEffect
const useSSRLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * Receives an object or array, after each it update it will check if the value
 * is equal to the last one, in case they are it will keep returning the same
 * reference to the old value, if they are different it will update the stored
 * reference and return the new one
 */
export default function useConsistentValue<Value>(
  value: Value,
  compare = fastDeepEqual
): Value {
  const [consistentValue, setState] = React.useState(value);
  useSSRLayoutEffect(() => {
    if (compare(value, consistentValue)) return;
    setState(value);
  }, [value]);
  return consistentValue;
}
