import { type Metadata } from "next";
import { cacheLife } from "next/cache";
import { redirect } from "next/navigation";
import npa from "npm-package-arg";
import { type JSX, Suspense } from "react";
import { type ViewType } from "react-diff-view";
import Skeleton from "^/components/ui/Skeleton";
import getVersionData from "^/lib/api/npm/getVersionData";
import packument from "^/lib/api/npm/packument";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import { parseQuery, type QueryParams } from "^/lib/query";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import decodeParts from "^/lib/utils/decodeParts";
import { generateComparisons } from "^/lib/utils/generateComparisons";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";
import BundlephobiaDiff from "./_page/BundlephobiaDiff";
import ComparisonList from "./_page/catalog/ComparisonList";
import PackageMeta from "./_page/catalog/PackageMeta";
import DiffIntro from "./_page/DiffIntro";
import NpmDiff from "./_page/NpmDiff";
import PackagephobiaDiff from "./_page/PackagephobiaDiff";
import { type DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";
import Sources from "./_page/Sources/Sources";

export interface DiffPageProps {
    params: Promise<{ parts: string | string[] }>;
    searchParams: Promise<QueryParams & { [DIFF_TYPE_PARAM_NAME]: ViewType }>;
}

export async function generateMetadata({
    params,
}: DiffPageProps): Promise<Metadata> {
    const { parts } = await params;
    const specs = splitParts(decodeParts(parts));

    // Check if this is a catalog page (single package name without version)
    if (specs.length === 1) {
        const parsed = npa(specs[0]);
        if (parsed.rawSpec === "*" && parsed.name) {
            return {
                title: `${parsed.name} - Package Catalog`,
                description: `Version catalog and comparison links for the npm package "${parsed.name}"`,
            };
        }
    }

    const [a, b] = specs.map((spec) => createSimplePackageSpec(spec));

    return {
        title: `Comparing ${simplePackageSpecToString(a)}...${simplePackageSpecToString(b)}`,
        description: `A diff between the npm packages "${simplePackageSpecToString(a)}" and "${simplePackageSpecToString(b)}"`,
    };
}

async function CatalogPageInner({ packageName }: { packageName: string }) {
    "use cache";

    cacheLife("hours");

    // Fetch package data
    const [pack, versionMap] = await Promise.all([
        packument(packageName),
        getVersionData(packageName),
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

const DiffPageInner = async ({
    params,
    searchParams,
}: DiffPageProps): Promise<JSX.Element> => {
    const { parts } = await params;
    const { diffFiles, ...optionsQuery } = await searchParams;

    const specsOrVersions = splitParts(decodeParts(parts));

    // Check if this is a catalog page (single package name without version)
    if (specsOrVersions.length === 1) {
        const parsed = npa(specsOrVersions[0]);
        if (parsed.rawSpec === "*" && parsed.name) {
            // This is a catalog page
            return (
                <Suspense fallback={<CatalogPageFallback />}>
                    <CatalogPageInner packageName={parsed.name} />
                </Suspense>
            );
        }
    }

    const { redirect: redirectTarget, canonicalSpecs } =
        await destination(specsOrVersions);

    if (redirectTarget !== false) {
        const specsStr = specsToDiff(canonicalSpecs);
        const searchStr = Object.entries(await searchParams)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

        redirect(
            `/${specsStr}` + (searchStr?.length > 0 ? `?${searchStr}` : ""),
        );
    } else {
        const options = parseQuery({
            // If no diffFiles is passed, use the default.
            // This is done here, since we don't want a fall back in the API
            diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
            ...optionsQuery,
        });

        const [a, b] = canonicalSpecs.map((spec) =>
            createSimplePackageSpec(spec),
        );

        return (
            <>
                <DiffIntro
                    className="self-stretch"
                    a={a}
                    b={b}
                    services={
                        <>
                            <Sources
                                a={a}
                                b={b}
                                suspenseKey={
                                    "sources-" + canonicalSpecs.join("...")
                                }
                            />
                            <BundlephobiaDiff
                                a={a}
                                b={b}
                                specs={canonicalSpecs}
                                suspenseKey={
                                    "bundlephobia-" + canonicalSpecs.join("...")
                                }
                            />
                            <PackagephobiaDiff
                                a={a}
                                b={b}
                                specs={canonicalSpecs}
                                suspenseKey={
                                    "packagephobia-" +
                                    canonicalSpecs.join("...")
                                }
                            />
                        </>
                    }
                    options={options}
                />
                <NpmDiff
                    a={a}
                    b={b}
                    specs={canonicalSpecs}
                    options={options}
                    suspenseKey={JSON.stringify([canonicalSpecs, options])}
                />
            </>
        );
    }
};

const DiffPage = (props: DiffPageProps) => {
    return (
        <Suspense>
            <DiffPageInner {...props} />
        </Suspense>
    );
};

export default DiffPage;
