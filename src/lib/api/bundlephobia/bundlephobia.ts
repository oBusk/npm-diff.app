import { cacheLife } from "next/cache";
import npa from "npm-package-arg";
import { USER_AGENT } from "../user-agent";
import type BundlephobiaResponse from "./BundlephobiaResponse";
import type BundlephobiaResults from "./BundlephobiaResults";

async function getPackage(spec: string): Promise<BundlephobiaResponse | null> {
    "use cache";

    const { scope } = npa(spec);

    if (scope === "@types") {
        cacheLife("max");
        return null;
    }

    try {
        const response = await fetch(
            `https://bundlephobia.com/api/size?package=${spec}`,
            {
                signal: AbortSignal.timeout(7_500),
                headers: {
                    "User-Agent": USER_AGENT,
                },
                // Opt out of fetch-level caching, we have caching in function
                cache: "no-store",
            },
        );

        if (response.status === 200) {
            const json: BundlephobiaResponse = await response.json();

            // If we succeed, cache as long as we're allowed
            cacheLife("max");

            return json;
        } else if (response.status === 403) {
            // Bundlephobia returns 403 forbidden for packages that are not supposed to be bundled.
            // This is a stable, permanent behaviour, so we cache forever.
            // For a list of packages; https://github.com/pastelsky/bundlephobia/blob/bundlephobia/server/config.js
            cacheLife("max");

            console.warn(`[${spec}] Bundlephobia returned 403 Forbidden`);

            return null;
        } else if (response.status === 404) {
            // Package not found, cache for a while
            cacheLife("hours");

            console.warn(`[${spec}] Bundlephobia returned 404 Not Found`);

            return null;
        } else if (response.status === 500) {
            // Server error, this is most likely because the package is too large or complex for Bundlephobia to handle.
            // We don't want to retry too often, but we also don't want to cache forever in case the issue is resolved.
            cacheLife("days");

            console.error(
                `[${spec}] Bundlephobia returned 500 Internal Server Error`,
            );

            return null;
        } else if (response.status === 520) {
            // Found when Bundlephobia has cloudflare issues.
            // Like https://github.com/pastelsky/bundlephobia/issues/823
            // https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-520/
            // We cache for a while, it usually takes a while to come back.
            cacheLife("days");

            console.warn(`[${spec}] Bundlephobia returned 520 Unknown Error`);

            return null;
        } else {
            // For other, unexpected statuses, we cache briefly and log the error.
            cacheLife("hours");

            console.error(
                `[${spec}] Bundlephobia returned unexpected status: ${response.status} ${response.statusText}`,
            );

            return null;
        }
    } catch (e) {
        if (e instanceof Error && e.name === "TimeoutError") {
            // Timing out is typical for large or complex packages.
            // We don't want to retry too often, but we also don't want to cache forever in case the issue is resolved.
            cacheLife("days");

            console.warn(`[${spec}] Bundlephobia request timed out`);

            return null;
        } else {
            // For other, unexpected errors, we cache briefly and log the error.
            cacheLife("hours");

            console.error(`[${spec}] Bundlephobia error:`, e);

            return null;
        }
    }

    return null;
}
async function getPackages(
    aSpec: string,
    bSpec: string,
): Promise<BundlephobiaResults | null> {
    const [a, b] = await Promise.all([getPackage(aSpec), getPackage(bSpec)]);

    return (a && b && { a, b }) || null;
}

export default async function bundlephobia([aSpec, bSpec]: [
    string,
    string,
]): Promise<BundlephobiaResults | null> {
    return getPackages(aSpec, bSpec);
}
