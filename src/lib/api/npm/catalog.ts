import { cacheLife } from "next/cache";
import { packument } from "pacote";
import { type CatalogSummary, summarizePackument } from "./catalogSummary";

export default async function catalogSummary(
    packageName: string,
): Promise<CatalogSummary> {
    "use cache";

    cacheLife("hours");

    return summarizePackument(
        await packument(packageName, { fullMetadata: true }),
    );
}
