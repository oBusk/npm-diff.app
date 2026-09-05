import { cacheLife } from "next/cache";
import { USER_AGENT } from "../user-agent";
import type PackagephobiaResponse from "./PackagephobiaResponse";
import type PackagephobiaResults from "./PackagephobiaResult";

async function getPackage(spec: string): Promise<PackagephobiaResponse | null> {
    "use cache: remote";

    try {
        const response = await fetch(
            `https://packagephobia.com/v2/api.json?p=${spec}`,
            {
                signal: AbortSignal.timeout(7_500),
                headers: {
                    "User-Agent": USER_AGENT,
                },
                cache: "no-store",
            },
        );

        if (response.status === 200) {
            const json: PackagephobiaResponse = await response.json();

            cacheLife("max");

            return json;
        } else if (response.status === 404) {
            cacheLife("hours");

            console.warn(`[${spec}] Packagephobia returned 404 Not Found`);

            return null;
        } else if (response.status === 429) {
            cacheLife("hours");

            console.warn(
                `[${spec}] Packagephobia returned 429 Too Many Requests`,
            );

            return null;
        } else {
            cacheLife("hours");

            console.warn(
                `[${spec}] Packagephobia returned ${response.status} ${response.statusText}`,
            );

            return null;
        }
    } catch (e) {
        if (e instanceof Error && e.name === "TimeoutError") {
            cacheLife("days");

            console.warn(`[${spec}] Packagephobia request timed out`);

            return null;
        } else {
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
