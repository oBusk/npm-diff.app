import { DependencyList, useMemo } from "react";
import throttle from "../utils/throttle";

function useThrottle<F extends (...args: any) => void>(
    fn: F,
    wait: number,
    deps: DependencyList | undefined,
): F {
    return useMemo(() => throttle(fn, wait), [fn, wait, ...(deps || [])]);
}

export default useThrottle;
