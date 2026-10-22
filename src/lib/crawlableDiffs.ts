import { cacheLife } from "next/cache";
import getPackageVersions from "^/lib/api/packageVersions";
import {
    type Comparison,
    generateComparisons,
} from "^/lib/utils/generateComparisons";
import specsToDiff from "^/lib/utils/specsToDiff";

export const CRAWLABLE_PACKAGES = [
    "react",
    "express",
    "lodash",
    "axios",
    "chalk",
    "commander",
    "semver",
    "debug",
    "uuid",
    "zod",
    "dotenv",
    "yargs",
] as const;

const CRAWLABLE_BUMP_TYPES: Comparison["type"][] = ["major", "minor"];

export function selectCrawlableDiffs(
    packageName: string,
    versions: string[],
): string[] {
    const comparisons = generateComparisons(versions);

    return CRAWLABLE_BUMP_TYPES.flatMap((type) => {
        const comparison = comparisons.find((c) => c.type === type);

        return comparison
            ? [
                  `/${specsToDiff([
                      `${packageName}@${comparison.from}`,
                      `${packageName}@${comparison.to}`,
                  ])}`,
              ]
            : [];
    });
}

export default async function getCrawlableDiffs(): Promise<string[]> {
    "use cache";

    cacheLife("days");

    const diffs = await Promise.all(
        CRAWLABLE_PACKAGES.map(async (packageName) => {
            try {
                const versions = await getPackageVersions(packageName);

                return versions
                    ? selectCrawlableDiffs(packageName, Object.keys(versions))
                    : [];
            } catch (e) {
                console.error(`[${packageName}] crawlable diffs error:`, e);

                return [];
            }
        }),
    );

    return diffs.flat();
}
