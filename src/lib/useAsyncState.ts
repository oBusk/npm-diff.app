import { SetStateAction, useEffect, useRef, useState } from "react";

/**
 * Very simplistic hook which works a lot like `useState()` but the input can
 * be a `Promise`, and `value` is updated with the the value that the promise
 * returns. Handles race conditions by not updating the state if a later
 * action has already resolved.
 */
export const useAsyncState = <T>(initialState: T) => {
    const [value, setSync] = useState(initialState);
    const index = useRef(0);
    const latestDelivered = useRef(-1);

    const setAsync = async (
        asyncState: SetStateAction<T> | Promise<SetStateAction<T>>,
    ) => {
        const currentIndex = index.current++;
        const result = await asyncState;
        if (currentIndex > latestDelivered.current) {
            latestDelivered.current = currentIndex;
            setSync(result);
        }
    };

    const cleanup = () => {
        // By setting this value to an unreachable value, we can ignore any future resolves
        latestDelivered.current = Number.MAX_SAFE_INTEGER;
    };

    useEffect(() => cleanup, []);

    return [value, setAsync] as const;
};

export default useAsyncState;