"use client";

import { HStack, useBreakpointValue } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import npa from "npm-package-arg";
import { FunctionComponent, memo, ReactNode, useMemo } from "react";
import { parseDiff, ViewType } from "react-diff-view";
import B from "^/components/B";
import Span from "^/components/Span";
import adjustDiff from "^/lib/adjustDiff";
import DiffOptions from "^/lib/DiffOptions";
import { MetaData } from "^/lib/metaData";
import countChanges from "^/lib/utils/countChanges";
import DiffFiles, { DiffFilesProps } from "./_page/DiffFiles";
import DiffIntro from "./_page/DiffIntro";
import ViewTypeSwitch from "./_page/DiffIntro/ViewTypeSwitch";
import NoDiff from "./_page/NoDiff";
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
        if (diff == null) {
            throw new Error("diff is null");
        } else if (diff == "") {
            return [];
        } else {
            const adjustedDiff = adjustDiff(diff);
            if (adjustedDiff) {
                return parseDiff(adjustedDiff);
            }
        }
    }, [diff]);

    if (aNpa == null || bNpa == null) {
        throw new Error("Specs could not be parsed");
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
            <DiffIntro
                alignSelf="stretch"
                a={aNpa}
                b={bNpa}
                services={services}
                options={options}
            />
            {files?.length > 0 ? (
                <MemoizedDiffFilesContent
                    a={aNpa}
                    b={bNpa}
                    files={files}
                    viewType={viewType}
                />
            ) : (
                <NoDiff
                    aName={aNpa.name!}
                    aVersion={aNpa.fetchSpec!}
                    bName={bNpa.name!}
                    bVersion={bNpa.fetchSpec!}
                />
            )}
        </MetaData>
    );
};

const DiffFilesContent = (props: DiffFilesProps) => {
    const { files, viewType } = props;

    const changes = files.map((file) => countChanges(file.hunks));
    const additions = changes
        .map(({ additions }) => additions)
        .reduce((a, b) => a + b, 0);
    const deletions = changes
        .map(({ deletions }) => deletions)
        .reduce((a, b) => a + b, 0);

    return (
        <>
            <HStack width="100%" justifyContent="space-between">
                <Span>
                    Showing <B>{files.length} changed files</B> with{" "}
                    <B>{additions} additions</B> and{" "}
                    <B>{deletions} deletions</B>
                </Span>
                <ViewTypeSwitch currentViewType={viewType} />
            </HStack>
            <DiffFiles {...props} />
        </>
    );
};

const MemoizedDiffFilesContent = memo(DiffFilesContent);

export default DiffPageClient;
