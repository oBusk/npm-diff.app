import { Center, useBreakpointValue } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import npa, { Result as NpaResult } from "npm-package-arg";
import { ParsedUrlQuery } from "querystring";
import { memo, useMemo, useState } from "react";
import type { File } from "react-diff-view";
import { parseDiff, ViewType } from "react-diff-view";
import DiffFiles from "^/components/Diff/DiffFiles";
import DiffIntro from "^/components/DiffIntro";
import ErrorBox from "^/components/ErrorBox";
import Layout from "^/components/Layout";
import adjustDiff from "^/lib/adjustDiff";
import bundlephobia, { BundlephobiaResults } from "^/lib/api/bundlephobia";
import packagephobia, { PackagephobiaResults } from "^/lib/api/packagephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import doDiff, { DiffError } from "^/lib/diff";
import DiffOptions from "^/lib/DiffOptions";
import measuredPromise from "^/lib/measuredPromise";
import { parseQuery, QueryParams, rawQuery } from "^/lib/query";
import { setDefaultPageCaching, setSwrCaching } from "^/lib/utils/headers";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";

type Props = {
    error?: string;
    result?: {
        diff: string;
        specs: [string, string];
        packagephobiaResults: PackagephobiaResults | null;
        bundlephobiaResults: BundlephobiaResults | null;
        options: DiffOptions;
    };
};

export const DIFF_TYPE_PARAM_NAME = "diff";

interface Params extends ParsedUrlQuery {
    parts: string | string[];
    [DIFF_TYPE_PARAM_NAME]: ViewType;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
    params: { parts } = {},
    query = {},
    req,
    res,
}) => {
    try {
        const { diffFiles, ...optionsQuery } = query as QueryParams;

        const specsOrVersions = splitParts(parts);
        const { redirect, canonicalSpecs } = await destination(specsOrVersions);

        if (redirect !== "temporary") {
            setDefaultPageCaching(res);
        }

        if (redirect === false) {
            const options = parseQuery({
                // If no diffFiles is passed, use the default.
                // This is done here, since we don't want a fall back in the API
                diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
                ...optionsQuery,
            });

            // Start eagerly
            const servicesPromises = Promise.all([
                measuredPromise(packagephobia(canonicalSpecs)),
                measuredPromise(bundlephobia(canonicalSpecs)),
            ]);
            let diff: string = "";
            let diffTime: number = -1;
            try {
                ({ result: diff, time: diffTime } = await measuredPromise(
                    doDiff(canonicalSpecs, options),
                ));
            } catch (e) {
                const { code, error } = e as DiffError;

                res.statusCode = code;

                return {
                    props: {
                        error,
                    },
                };
            }

            let [
                { result: packagephobiaResults, time: packagephobiaTime },
                { result: bundlephobiaResults, time: bundlephobiaTime },
            ] = await servicesPromises;

            if (packagephobiaResults === TIMED_OUT) {
                // If packagephobia timed out, we don't want to cache forever, instead use SWR caching
                setSwrCaching(res);
                packagephobiaResults = null;
            }

            if (bundlephobiaResults === TIMED_OUT) {
                // If bundlephobia timed out, we don't want to cache forever, instead use SWR cachin
                setSwrCaching(res);
                bundlephobiaResults = null;
            }

            console.log({
                specs: canonicalSpecs,
                timings: {
                    diff: diffTime,
                    packagephobia: packagephobiaTime,
                    bundlephobia: bundlephobiaTime,
                },
                caching: res.getHeader("Cache-Control"),
            });

            return {
                props: {
                    result: {
                        specs: canonicalSpecs,
                        diff,
                        packagephobiaResults,
                        bundlephobiaResults,
                        options,
                    },
                },
            };
        } else {
            return {
                redirect: {
                    permanent: redirect === "permanent",
                    destination:
                        `/${specsToDiff(canonicalSpecs)}` +
                        rawQuery(req, "parts"),
                },
            };
        }
    } catch (e: any) {
        return {
            props: {
                error: e?.message ?? e ?? "Unknown error",
            },
        };
    }
};

const DiffPage: NextPage<Props> = ({ error, result }) => {
    const { diff, packagephobiaResults, bundlephobiaResults, options } =
        result!;

    const router = useRouter();
    // Even if the initial value and the first breakpoint value is the same,
    // the component will re-render. This means it will _always_ render twice
    // even when it shouldn't have to.
    // We work around this by memoizing the rendering of the component.
    const defaultViewType = useBreakpointValue<ViewType>(
        {
            base: "unified",
            lg: "split",
        },
        // We assume that most users are on a computer so default to "lg".
        // We could use something like https://github.com/kaimallea/isMobile
        // but that means cache should be different for desktop/mobile
        "lg",
    )!;

    const [a, b] = result?.specs ?? [];
    const aNpa = useMemo(() => (a ? npa(a) : undefined), [a]);
    const bNpa = useMemo(() => (b ? npa(b) : undefined), [b]);
    const files = useMemo(() => {
        if (diff) {
            const adjustedDiff = adjustDiff(diff);
            if (adjustedDiff) {
                return parseDiff(adjustedDiff);
            }
        }

        return null;
    }, [diff]);

    if (aNpa === undefined || bNpa === undefined) {
        return (
            <Layout title="Error">
                <ErrorBox>Specs could not be parsed</ErrorBox>
            </Layout>
        );
    }

    if (diff === "") {
        return (
            <Layout
                title={`Comparing ${a}...${b}`}
                description={`A diff between the npm packages "${a}" and "${b}"`}
            >
                <DiffIntro
                    a={aNpa}
                    b={bNpa}
                    files={[]}
                    packagephobiaResults={null}
                    bundlephobiaResults={null}
                    options={options}
                    viewType="unified"
                    alignSelf="stretch"
                />
            </Layout>
        );
    }

    if (files == null) {
        return (
            <Layout title="Error">
                <Center>
                    <ErrorBox>Files could not be parsed</ErrorBox>
                </Center>
            </Layout>
        );
    }

    if (error != null) {
        return (
            <Layout title="Error">
                <Center>
                    <ErrorBox>{error}</ErrorBox>
                </Center>
            </Layout>
        );
    }

    const viewType =
        // If specified in URL, use that
        router.query[DIFF_TYPE_PARAM_NAME] === "split"
            ? "split"
            : router.query[DIFF_TYPE_PARAM_NAME] === "unified"
            ? "unified"
            : // If not, use default based on screen size
              defaultViewType;

    return (
        <Layout
            title={`Comparing ${a}...${b}`}
            description={`A diff between the npm packages "${a}" and "${b}"`}
        >
            <MemoizedDiffPageContent
                aNpa={aNpa}
                bNpa={bNpa}
                files={files}
                packagephobiaResults={packagephobiaResults}
                bundlephobiaResults={bundlephobiaResults}
                options={options}
                viewType={viewType}
            />
        </Layout>
    );
};

const DiffPageContent = ({
    aNpa,
    bNpa,
    files,
    packagephobiaResults,
    bundlephobiaResults,
    options,
    viewType,
}: {
    aNpa: NpaResult;
    bNpa: NpaResult;
    files: File[];
    packagephobiaResults: PackagephobiaResults | null;
    bundlephobiaResults: BundlephobiaResults | null;
    options: DiffOptions;
    viewType: ViewType;
}) => (
    <>
        <DiffIntro
            a={aNpa}
            b={bNpa}
            files={files}
            packagephobiaResults={packagephobiaResults}
            bundlephobiaResults={bundlephobiaResults}
            options={options}
            viewType={viewType}
            alignSelf="stretch"
        />
        <DiffFiles a={aNpa} b={bNpa} files={files} viewType={viewType as any} />
    </>
);

const MemoizedDiffPageContent = memo(DiffPageContent);

export default DiffPage;
