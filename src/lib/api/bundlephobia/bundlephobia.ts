import npa from "npm-package-arg";
import type BundlephobiaResponse from "./BundlephobiaResponse";
import type BundlephobiaResults from "./BundlephobiaResults";

async function getPackage(spec: string): Promise<BundlephobiaResponse | null> {
    const { scope } = npa(spec);

    if (scope === "@types") {
        return null;
    }

    try {
        const response = await fetch(
            `https://bundlephobia.com/api/size?package=${spec}`,
            {
                signal: AbortSignal.timeout(7_500),
            },
        );

        if (response.status !== 200) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const json: BundlephobiaResponse = await response.json();

        return json;
    } catch (e) {
        console.error(`[${spec}] Bundlephobia error:`, e);
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
