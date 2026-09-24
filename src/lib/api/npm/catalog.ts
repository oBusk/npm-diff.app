import { cacheLife } from "next/cache";
import npa from "npm-package-arg";
import { packument as pacotePackument } from "pacote";
import { type CatalogSummary, summarizePackument } from "./catalogSummary";

async function catalogSummaryForPackage(
    packageName: string,
): Promise<CatalogSummary> {
    "use cache";

    cacheLife("hours");

    const packument = await pacotePackument(packageName, {
        fullMetadata: true,
        cache: undefined,
    });

    return summarizePackument(packument);
}

export default function catalogSummary(spec: string): Promise<CatalogSummary> {
    const { name } = npa(spec);

    if (!name) {
        throw new Error(`Could not extract package name from: ${spec}`);
    }

    return catalogSummaryForPackage(name);
}
