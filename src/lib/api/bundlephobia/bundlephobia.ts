import { cacheLife } from "next/cache";
import npa from "npm-package-arg";
import { USER_AGENT } from "../user-agent";
import type BundlephobiaResponse from "./BundlephobiaResponse";
import type BundlephobiaResults from "./BundlephobiaResults";

async function getPackage(spec: string): Promise<BundlephobiaResponse | null> {
    "use cache: remote";

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
                cache: "no-store",
            },
        );

        if (response.status === 200) {
            const json: BundlephobiaResponse = await response.json();

            cacheLife("max");

            return json;
        } else if (response.status === 403) {
            // Bundlephobia returns 403 forbidden for packages that are not supposed to be bundled.
            // For a list of packages; https://github.com/pastelsky/bundlephobia/blob/bundlephobia/server/config.js
            cacheLife("max");

            console.warn(`[${spec}] Bundlephobia returned 403 Forbidden`);

            return null;
        } else if (response.status === 404) {
            cacheLife("hours");

            console.warn(`[${spec}] Bundlephobia returned 404 Not Found`);

            return null;
        } else if (response.status === 500) {
            cacheLife("days");

            console.warn(
                `[${spec}] Bundlephobia returned 500 Internal Server Error`,
            );

            return null;
        } else if (response.status === 520) {
            // https://github.com/pastelsky/bundlephobia/issues/823
            cacheLife("days");

            console.warn(`[${spec}] Bundlephobia returned 520 Unknown Error`);

            return null;
        } else {
            cacheLife("hours");

            console.error(
                `[${spec}] Bundlephobia returned unexpected status: ${response.status} ${response.statusText}`,
            );

            return null;
        }
    } catch (e) {
        if (e instanceof Error && e.name === "TimeoutError") {
            cacheLife("days");

            console.warn(`[${spec}] Bundlephobia request timed out`);

            return null;
        } else {
            cacheLife("hours");

            console.error(`[${spec}] Bundlephobia error:`, e);

            return null;
        }
    }
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
