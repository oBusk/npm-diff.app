import { useMemo } from "react";
import throttle from "../utils/throttle";

function useThrottle<F extends (...args: any) => void>(fn: F, wait: number): F {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => throttle(fn, wait), []);
}

export default useThrottle;
