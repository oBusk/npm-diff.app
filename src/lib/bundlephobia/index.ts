import { BundlephobiaResponse } from "./BundlephobiaResponse";

export interface BundlephobiaResults {
    a: BundlephobiaResponse;
    b: BundlephobiaResponse;
}

async function getPackage(spec: string): Promise<BundlephobiaResponse | null> {
    const response = await fetch(
        `https://bundlephobia.com/api/size?package=${spec}`,
    );
    if (response.status === 200) {
        const json: BundlephobiaResponse = await response.json();
        return json;
    } else if (response.status === 403) {
        // The package is blacklisted or not supported
        return null;
    } else {
        throw new Error(
            `Error fetching ${spec}, status: ${response.status}, message: ${
                (await response.json())?.message
            }`,
        );
    }
}

export async function bundlephobia([aSpec, bSpec]: [
    string,
    string,
]): Promise<BundlephobiaResults | null> {
    try {
        const [a, b] = await Promise.all([
            getPackage(aSpec),
            getPackage(bSpec),
        ]);

        return a && b && { a, b };
    } catch (e) {
        console.error(e);
    }

    return null;
}
