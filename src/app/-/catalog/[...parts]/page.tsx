import { type Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { type JSX } from "react";
import getCatalogSummary from "^/lib/api/npm/catalogSummary";
import { generateComparisons } from "^/lib/utils/generateComparisons";
import { getCatalogPackageName } from "^/lib/utils/isCatalogPage";
import parseParts from "^/lib/utils/parseParts";
import ComparisonList from "./_page/ComparisonList";
import { generateCatalogMetadata } from "./_page/generateCatalogMetadata";
import PackageMeta from "./_page/PackageMeta";

export const maxDuration = 15;

type CatalogRouteProps = Pick<PageProps<"/-/catalog/[...parts]">, "params">;

async function parseCatalogName(params: CatalogRouteProps["params"]) {
    const { parts } = await params;
    const specs = parseParts(parts.join("/"), { decode: true });
    const packageName = specs && getCatalogPackageName(specs);

    if (!packageName) {
        notFound();
    }

    return packageName;
}

export async function generateMetadata({
    params,
}: CatalogRouteProps): Promise<Metadata> {
    return generateCatalogMetadata(await parseCatalogName(params));
}

export default async function CatalogPage({
    params,
}: CatalogRouteProps): Promise<JSX.Element> {
    "use cache";

    const packageName = await parseCatalogName(params);
    const summary = await getCatalogSummary(packageName);

    if (summary.cacheLife === "minutes") {
        cacheLife("minutes");
    } else {
        cacheLife("hours");
    }

    const comparisons = generateComparisons(summary.versions);

    return (
        <div className="mx-auto w-full max-w-7xl py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
                <div className="flex min-w-0 flex-col">
                    <PackageMeta summary={summary} />
                </div>
                <div className="flex flex-col">
                    <ComparisonList
                        packageName={packageName}
                        comparisons={comparisons}
                    />
                </div>
            </div>
        </div>
    );
}
