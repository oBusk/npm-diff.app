import { useCallback, useState } from "react";

/**
 * Hook to force a re-render of the component.
 */
function useForceUpdate() {
    const [, setCount] = useState(0);

    return useCallback(function forceUpdate() {
        setCount((count) => count + 1);
    }, []);
}

export default useForceUpdate;
