"use client";

import { useBreakpointValue } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import npa from "npm-package-arg";
import { FunctionComponent, memo, ReactNode, useMemo } from "react";
import { parseDiff, ViewType } from "react-diff-view";
import adjustDiff from "^/lib/adjustDiff";
import DiffOptions from "^/lib/DiffOptions";
import { MetaData } from "^/lib/metaData";
import DiffFiles, { DiffFilesProps } from "./_page/DiffFiles";
import DiffIntro from "./_page/DiffIntro";
import { DiffIntroProps } from "./_page/DiffIntro/DiffIntro";
import { DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";

export interface DiffPageClientProps {
    diff: string;
    specs: [string, string];
    services: ReactNode;
    options: DiffOptions;
}

const DiffPageClient: FunctionComponent<DiffPageClientProps> = ({
    specs,
    diff,
    options,
    services,
}) => {
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

    const [a, b] = specs ?? [];
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
        throw new Error("Specs could not be parsed");
    }

    if (diff === "") {
        return (
            <MetaData
                title={`Comparing ${a}...${b}`}
                description={`A diff between the npm packages "${a}" and "${b}"`}
            >
                <DiffIntro
                    a={aNpa}
                    b={bNpa}
                    files={[]}
                    services={services}
                    options={options}
                    viewType="unified"
                    alignSelf="stretch"
                />
            </MetaData>
        );
    }

    if (files == null) {
        throw new Error("Files could not be parsed");
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
        <MetaData
            title={`Comparing ${a}...${b}`}
            description={`A diff between the npm packages "${a}" and "${b}"`}
        >
            <MemoizedDiffPageContent
                a={aNpa}
                b={bNpa}
                files={files}
                services={services}
                options={options}
                viewType={viewType}
            />
        </MetaData>
    );
};

const DiffPageContent = (props: DiffIntroProps & DiffFilesProps) => (
    <>
        <DiffIntro alignSelf="stretch" {...props} />
        <DiffFiles {...props} />
    </>
);

const MemoizedDiffPageContent = memo(DiffPageContent);

export default DiffPageClient;
