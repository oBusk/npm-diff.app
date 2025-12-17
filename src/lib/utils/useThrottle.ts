import { useEffect, useRef, useState } from "react";
import { useUnmount } from "react-use";

// Copy of `react-use/useThrottle` that works around
// https://github.com/streamich/react-use/issues/2343
// Once this issue is closed, we should be able to remove this file
const useThrottle = <T>(value: T, ms: number = 200) => {
    const [state, setState] = useState<T | null>(value);
    const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
    const nextValue = useRef<T | null>(null);
    const hasNextValue = useRef<boolean | 0>(0);

    useEffect(() => {
        if (!timeout.current) {
            setState(value);
            const timeoutCallback = () => {
                if (hasNextValue.current) {
                    hasNextValue.current = false;
                    setState(nextValue.current);
                    timeout.current = setTimeout(timeoutCallback, ms);
                } else {
                    timeout.current = undefined;
                }
            };
            timeout.current = setTimeout(timeoutCallback, ms);
        } else {
            nextValue.current = value;
            hasNextValue.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useUnmount(() => {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = undefined;
        nextValue.current = null;
        hasNextValue.current = 0;
    });

    return state;
};

export default useThrottle;
