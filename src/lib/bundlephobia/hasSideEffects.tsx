import { BundlephobiaResponse } from "lib/bundlephobia/BundlephobiaResponse";

export function hasSideEffects({
    hasSideEffects,
}: BundlephobiaResponse): true | false | "some" {
    // Based on functionality in bundlephobia:
    // https://github.com/pastelsky/bundlephobia/blob/28bde79/client/components/QuickStatsBar/QuickStatsBar.js#L74-L81
    return Array.isArray(hasSideEffects)
        ? hasSideEffects.length > 0
            ? "some"
            : false
        : hasSideEffects;
}
