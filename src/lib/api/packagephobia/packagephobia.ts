import { USER_AGENT } from "../user-agent";
import type PackagephobiaResponse from "./PackagephobiaResponse";
import type PackagephobiaResults from "./PackagephobiaResult";

async function getPackage(spec: string): Promise<PackagephobiaResponse | null> {
    try {
        const response = await fetch(
            `https://packagephobia.com/v2/api.json?p=${spec}`,
            {
                signal: AbortSignal.timeout(7_500),
                headers: {
                    "User-Agent": USER_AGENT,
                },
            },
        );

        if (response.status !== 200) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const json: PackagephobiaResponse = await response.json();

        return json;
    } catch (e) {
        console.error(`[${spec}] Packagephobia error:`, e);
    }

    return null;
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
