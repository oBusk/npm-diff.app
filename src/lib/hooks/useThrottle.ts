import { useMemo } from "react";
import throttle from "../utils/throttle";

/**
 * Memoizes a throttled function.
 *
 * Throttled functions can be called how many times you like,
 * but will only execute `fn` at most every `wait` ms.
 */
function useThrottle<F extends (...args: any) => void>(fn: F, wait: number): F {
    return useMemo(() => throttle(fn, wait), [fn, wait]);
}

export default useThrottle;
