import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { type JSX, Suspense } from "react";
import { type ViewType } from "react-diff-view";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Skeleton from "^/components/ui/Skeleton";
import Stack from "^/components/ui/Stack";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import { cx } from "^/lib/cva";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination, {
    type Destination,
    SpecNotFoundError,
} from "^/lib/destination";
import {
    parseDiffOptions,
    type QueryParams,
    toSearchString,
} from "^/lib/query";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import contentVisibility from "^/lib/utils/contentVisibility";
import { isCatalogPage } from "^/lib/utils/isCatalogPage";
import parseParts from "^/lib/utils/parseParts";
import specsToDiff from "^/lib/utils/specsToDiff";
import ErrorBox from "./_error/ErrorBox";
import BundlephobiaDiff, {
    BundlephobiaDiffSkeleton,
} from "./_page/BundlephobiaDiff";
import CatalogPage from "./_page/catalog/CatalogPage";
import { generateCatalogMetadata } from "./_page/catalog/generateCatalogMetadata";
import DiffIntro from "./_page/DiffIntro";
import Halfs from "./_page/DiffIntro/Halfs";
import { SpecBoxSkeleton } from "./_page/DiffIntro/SpecBox";
import NpmDiff from "./_page/NpmDiff";
import NpmDiffSkeleton from "./_page/NpmDiff/NpmDiff.skeleton";
import PackagephobiaDiff, {
    PackagephobiaDiffSkeleton,
} from "./_page/PackagephobiaDiff";
import { type DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";
import Sources, { SourcesFallback } from "./_page/Sources/Sources";

export const maxDuration = 60;

export interface DiffPageProps {
    params: Promise<{ parts: string | string[] }>;
    searchParams: Promise<QueryParams & { [DIFF_TYPE_PARAM_NAME]: ViewType }>;
}

export async function generateMetadata({
    params,
}: DiffPageProps): Promise<Metadata> {
    const { parts } = await params;
    const specs = parseParts(parts, { decode: true });

    if (specs == null) {
        notFound();
    }

    if (isCatalogPage(specs)) {
        return generateCatalogMetadata(specs);
    }

    const [a, b] = specs.map((spec) => createSimplePackageSpec(spec));

    return {
        title: `Comparing ${simplePackageSpecToString(a)}...${simplePackageSpecToString(b)}`,
        description: `A diff between the npm packages "${simplePackageSpecToString(a)}" and "${simplePackageSpecToString(b)}"`,
    };
}

const DiffPageInner = async ({
    params,
    searchParams,
}: DiffPageProps): Promise<JSX.Element> => {
    const { parts } = await params;
    const query = await searchParams;
    const { diffFiles, ...optionsQuery } = query;

    const specsOrVersions = parseParts(parts, { decode: true });

    if (specsOrVersions == null) {
        notFound();
    }

    if (isCatalogPage(specsOrVersions)) {
        return <CatalogPage specs={specsOrVersions} />;
    }

    const parsedOptions = parseDiffOptions({
        // If no diffFiles is passed, use the default.
        // This is done here, since we don't want a fall back in the API
        diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
        ...optionsQuery,
    });

    if (!parsedOptions.ok) {
        return (
            <ErrorBox className="flex flex-col items-start gap-2 self-center">
                <h3>Invalid options</h3>
                <Code className="max-w-2xl">{parsedOptions.message}</Code>
            </ErrorBox>
        );
    }

    let target: Destination;
    try {
        target = await destination(specsOrVersions);
    } catch (e) {
        if (e instanceof SpecNotFoundError) {
            notFound();
        }
        throw e;
    }

    const { redirect: redirectTarget, canonicalSpecs } = target;

    if (redirectTarget !== false) {
        redirect(`/${specsToDiff(canonicalSpecs)}${toSearchString(query)}`);
    } else {
        const { options } = parsedOptions;

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

function DiffPageFallback() {
    return (
        <>
            <Stack
                align="center"
                className={cx("self-stretch", contentVisibility("700px"))}
            >
                <Heading className="mb-6 w-full text-center text-sm">
                    <span>Comparing</span>
                    <Halfs
                        left={<SpecBoxSkeleton pkgClassName="rounded-r-none" />}
                        center={
                            <span>
                                <Code className="rounded-none">...</Code>
                            </span>
                        }
                        right={
                            <SpecBoxSkeleton pkgClassName="rounded-l-none" />
                        }
                    />
                </Heading>
                <SourcesFallback />
                <BundlephobiaDiffSkeleton />
                <PackagephobiaDiffSkeleton />
                <Heading h={3} className="mt-4 text-sm">
                    npm diff
                </Heading>
                <Skeleton className="my-2 h-20 w-64" />
            </Stack>
            <NpmDiffSkeleton />
        </>
    );
}

const DiffPage = (props: DiffPageProps) => {
    return (
        <Suspense fallback={<DiffPageFallback />}>
            <DiffPageInner {...props} />
        </Suspense>
    );
};

export default DiffPage;
