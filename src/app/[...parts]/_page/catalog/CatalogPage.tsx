import { cacheLife } from "next/cache";
import { Suspense } from "react";
import Skeleton from "^/components/ui/Skeleton";
import getVersionData from "^/lib/api/npm/getVersionData";
import packument from "^/lib/api/npm/packument";
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
    const [pack, versionMap] = await Promise.all([
        packument(packageName),
        getVersionData(packageName),
    ]);

    // Get all versions
    const versions = Object.keys(versionMap);

    // Generate comparisons
    const comparisons = generateComparisons(versions);

    return (
        <div className="mx-auto w-full max-w-7xl py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="flex flex-col">
                    <PackageMeta packument={pack} />
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
