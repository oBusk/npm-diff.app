import { canonicalSpec as baseCanonicalSpec } from "@internal/npm-spec";
import { cacheLife } from "next/cache";

/**
 * Cached version of canonicalSpec that uses Next.js cache.
 *
 * Takes a single registry specifier ("spec") and returns a "canonical"
 * registry specifier with Next.js caching applied.
 */
async function canonicalSpec(spec: string): Promise<string> {
    "use cache";

    cacheLife("hours");

    return baseCanonicalSpec(spec);
}

export default canonicalSpec;
