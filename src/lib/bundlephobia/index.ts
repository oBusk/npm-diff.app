import { BundlephobiaResponse } from "./BundlephobiaResponse";

export interface BundlephobiaResults {
    a: BundlephobiaResponse;
    b: BundlephobiaResponse;
}

async function getPackage(spec: string): Promise<BundlephobiaResponse> {
    const response = await fetch(
        `https://bundlephobia.com/api/size?package=${spec}`,
    );
    const json: BundlephobiaResponse = await response.json();
    return json;
}

export async function bundlephobia([aSpec, bSpec]: [
    string,
    string,
]): Promise<BundlephobiaResults> {
    const [a, b] = await Promise.all([getPackage(aSpec), getPackage(bSpec)]);

    return { a, b };
}
