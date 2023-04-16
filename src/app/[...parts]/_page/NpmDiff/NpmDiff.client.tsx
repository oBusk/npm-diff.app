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
}: NpmDiffClientProps) => (
    <>
        <HStack width="100%" justifyContent="space-between">
            <Span>
                Showing <B>{props.files.length} changed files</B> with{" "}
                <B>{additions} additions</B> and <B>{deletions} deletions</B>
            </Span>
            {/* Wrap in suspense because components use dynamic function https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#using-dynamic-functions */}
            <Suspense>
                <ViewTypeSwitch />
            </Suspense>
        </HStack>
        <DiffFiles {...props} />
    </>
);

export default NpmDiffClient;
