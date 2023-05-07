import { useState } from "react";
import { useEffectOnce } from "react-use";

/**
 * Hook that returns false before mounted, triggers a re-render when mounted,
 * and returns true after mounted.
 *
 * Based on
 * https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
 */
export default function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffectOnce(() => setMounted(true));

    return mounted;
}
