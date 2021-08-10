import { useMemo } from "react";
import throttle from "./throttle";

function useThrottle<F extends (...args: any) => void>(
    fn: F,
    wait: number,
    leading = false,
): F {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => throttle(fn, wait, leading), []);
}

export default useThrottle;
