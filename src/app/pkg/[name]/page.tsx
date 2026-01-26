import { type Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import Skeleton from "^/components/ui/Skeleton";
import getVersionData from "^/lib/api/npm/getVersionData";
import packument from "^/lib/api/npm/packument";
import { generateComparisons } from "^/lib/utils/generateComparisons";
import ComparisonList from "./_page/ComparisonList";
import PackageMeta from "./_page/PackageMeta";

export interface PackagePageProps {
    params: Promise<{ name: string }>;
}

export async function generateMetadata({
    params,
}: PackagePageProps): Promise<Metadata> {
    const { name } = await params;

    return {
        title: `${name} - Package Catalog`,
        description: `Version catalog and comparison links for the npm package "${name}"`,
    };
}

async function PackagePageInner({ params }: PackagePageProps) {
    "use cache";

    cacheLife("hours");

    const { name } = await params;

    // Fetch package data
    const [pack, versionMap] = await Promise.all([
        packument(name),
        getVersionData(name),
    ]);

    // Get all versions
    const versions = Object.keys(versionMap);

    // Generate comparisons
    const comparisons = generateComparisons(versions, versionMap);

    return (
        <div className="mx-auto w-full max-w-7xl py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="flex flex-col">
                    <PackageMeta packument={pack} />
                </div>
                <div className="flex flex-col">
                    <ComparisonList
                        packageName={name}
                        comparisons={comparisons}
                    />
                </div>
            </div>
        </div>
    );
}

function PackagePageFallback() {
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

export default function PackagePage(props: PackagePageProps) {
    return (
        <Suspense fallback={<PackagePageFallback />}>
            <PackagePageInner {...props} />
        </Suspense>
    );
}
