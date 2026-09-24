import { cacheLife } from "next/cache";
import { Suspense } from "react";
import Skeleton from "^/components/ui/Skeleton";
import catalogSummary from "^/lib/api/npm/catalog";
import { generateComparisons } from "^/lib/utils/generateComparisons";
import { getCatalogPackageName } from "^/lib/utils/isCatalogPage";
import ComparisonList from "./ComparisonList";
import PackageMeta from "./PackageMeta";

export interface CatalogPageProps {
    specs: string[];
}

async function CatalogPageInner({ specs }: CatalogPageProps) {
    "use cache";

    cacheLife("hours");

    const packageName = getCatalogPackageName(specs);

    if (!packageName) {
        throw new Error("Invalid catalog page specs");
    }

    // Fetch package data
    const summary = await catalogSummary(packageName);

    // Generate comparisons
    const comparisons = generateComparisons(summary.versions);

    return (
        <div className="mx-auto w-full max-w-7xl py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
                <div className="flex flex-col">
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

function CatalogPageFallback() {
    return (
        <div className="mx-auto w-full max-w-7xl py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
                <div className="flex flex-col">
                    <Skeleton className="h-96 w-full rounded-md" />
                </div>
                <div className="flex flex-col">
                    <Skeleton className="h-96 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
}

export default function CatalogPage(props: CatalogPageProps) {
    return (
        <Suspense fallback={<CatalogPageFallback />}>
            <CatalogPageInner {...props} />
        </Suspense>
    );
}
