import { PackagephobiaResponse } from "./PackagephobiaResponse";

export interface PackagephobiaResults {
    a: PackagephobiaResponse;
    b: PackagephobiaResponse;
}

async function getPackage(spec: string): Promise<PackagephobiaResponse> {
    const response = await fetch(
        `https://packagephobia.com/v2/api.json?p=${spec}`,
    );
    const json: PackagephobiaResponse = await response.json();
    return json;
}

export async function packagephobia([aSpec, bSpec]: [
    string,
    string,
]): Promise<PackagephobiaResults> {
    const [a, b] = await Promise.all([getPackage(aSpec), getPackage(bSpec)]);

    return { a, b };
}
