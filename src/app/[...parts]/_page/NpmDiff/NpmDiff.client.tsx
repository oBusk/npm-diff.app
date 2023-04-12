"use client";

import { HStack, useBreakpointValue } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ViewType } from "react-diff-view";
import B from "^/components/B";
import Span from "^/components/Span";
import { DIFF_TYPE_PARAM_NAME } from "../paramNames";
import DiffFiles, { DiffFilesProps } from "./DiffFiles";
import ViewTypeSwitch from "./ViewTypeSwitch";

export interface NpmDiffClientProps extends Omit<DiffFilesProps, "viewType"> {
    additions: number;
    deletions: number;
}

const NpmDiffClient = ({
    additions,
    deletions,
    ...props
}: NpmDiffClientProps) => {
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

    const viewType =
        // If specified in URL, use that
        (searchParams?.get(DIFF_TYPE_PARAM_NAME) === "split" && "split") ||
        (searchParams?.get(DIFF_TYPE_PARAM_NAME) === "unified" && "unified") ||
        // If not, use default based on screen size
        defaultViewType;

    return (
        <>
            <HStack width="100%" justifyContent="space-between">
                <Span>
                    Showing <B>{props.files.length} changed files</B> with{" "}
                    <B>{additions} additions</B> and{" "}
                    <B>{deletions} deletions</B>
                </Span>
                {/* Wrap in suspense because components use dynamic function https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#using-dynamic-functions */}
                <Suspense>
                    <ViewTypeSwitch currentViewType={viewType} />
                </Suspense>
            </HStack>
            <DiffFiles viewType={viewType} {...props} />
        </>
    );
};

export default NpmDiffClient;
