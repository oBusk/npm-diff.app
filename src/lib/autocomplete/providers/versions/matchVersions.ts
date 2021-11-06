import filterUntil from "^/lib/utils/filterUntil";

/**
 * Takes input parameters and and source and returns a subset of the source.
 */
export function matchVersions({
    rawSpec,
    versions,
    size,
}: {
    /** from `npa`. Like `1`, `1.2` or `1.2.3` */
    rawSpec: string;
    versions: ReadonlyArray<string>;
    size: number;
}): string[] {
    return filterUntil(
        // We want to show the most recent versions rather than the oldest
        [...versions].reverse(),
        // Very simplistic matcher
        (version) => version.startsWith(rawSpec),
        // Stops searching after finding X results
        size,
    );
}
