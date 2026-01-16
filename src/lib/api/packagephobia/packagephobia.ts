import { cacheLife } from "next/cache";
import { USER_AGENT } from "../user-agent";
import type PackagephobiaResponse from "./PackagephobiaResponse";
import type PackagephobiaResults from "./PackagephobiaResult";

async function getPackage(spec: string): Promise<PackagephobiaResponse | null> {
    "use cache";

    try {
        const response = await fetch(
            `https://packagephobia.com/v2/api.json?p=${spec}`,
            {
                signal: AbortSignal.timeout(7_500),
                headers: {
                    "User-Agent": USER_AGENT,
                },
                // Ensure no fetch-level caching, we have caching in function
                cache: "no-store",
            },
        );

        if (response.status === 200) {
            const json: PackagephobiaResponse = await response.json();

            // If we succeed, cache as long as we're allowed
            cacheLife("max");

            return json;
        } else if (response.status === 404) {
            // Package not found, cache for a while
            cacheLife("hours");

            console.warn(`[${spec}] Packagephobia returned 404 Not Found`);

            return null;
        } else if (response.status === 429) {
            // Rate limited, cache briefly
            cacheLife("hours");

            console.warn(
                `[${spec}] Packagephobia returned 429 Too Many Requests`,
            );

            return null;
        } else {
            // For other, unexpected status codes, we cache briefly and log the error.
            cacheLife("hours");

            console.warn(
                `[${spec}] Packagephobia returned ${response.status} ${response.statusText}`,
            );

            return null;
        }
    } catch (e) {
        if (e instanceof Error && e.name === "TimeoutError") {
            // Timing out is typical for large or complex packages.
            // We don't want to retry too often, but we also don't want to cache forever in case the issue is resolved.
            cacheLife("days");

            console.warn(`[${spec}] Packagephobia request timed out`);

            return null;
        } else {
            // For other errors, we cache briefly and log the error.
            cacheLife("hours");

            console.error(`[${spec}] Packagephobia request error:`, e);

            return null;
        }
    }
}

async function getPackages(
    aSpec: string,
    bSpec: string,
): Promise<PackagephobiaResults | null> {
    const [a, b] = await Promise.all([getPackage(aSpec), getPackage(bSpec)]);

    return (a && b && { a, b }) || null;
}

export default async function packagephobia([aSpec, bSpec]: [
    string,
    string,
]): Promise<PackagephobiaResults | null> {
    return getPackages(aSpec, bSpec);
}
