"use client";
import { Center, useBreakpointValue } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import npa, { Result as NpaResult } from "npm-package-arg";
import { FunctionComponent, memo, useMemo } from "react";
import type { File } from "react-diff-view";
import { parseDiff, ViewType } from "react-diff-view";
import DiffFiles from "^/components/Diff/DiffFiles";
import DiffIntro from "^/components/DiffIntro";
import ErrorBox from "^/components/ErrorBox";
import Layout from "^/components/Layout";
import DIFF_TYPE_PARAM_NAME from "^/DIFF_TYPE_PARAM_NAME";
import adjustDiff from "^/lib/adjustDiff";
import { BundlephobiaResults } from "^/lib/api/bundlephobia";
import { PackagephobiaResults } from "^/lib/api/packagephobia";
import DiffOptions from "^/lib/DiffOptions";

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

const DiffView: FunctionComponent<Props> = ({ error, result } = {}) => {
    const { diff, packagephobiaResults, bundlephobiaResults, options } =
        result! ?? {};

    const searchParams = useSearchParams();
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
        searchParams.get(DIFF_TYPE_PARAM_NAME) === "split"
            ? "split"
            : searchParams.get(DIFF_TYPE_PARAM_NAME) === "unified"
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

export default DiffView;
