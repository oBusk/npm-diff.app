"use client";

import { HStack } from "@chakra-ui/react";
import B from "^/components/B";
import Span from "^/components/Span";
import DiffFiles, { DiffFilesProps } from "./DiffFiles";
import ViewTypeSwitch from "./ViewTypeSwitch";

export interface NpmDiffClientProps extends DiffFilesProps {
    additions: number;
    deletions: number;
}

const NpmDiffClient = ({
    additions,
    deletions,
    ...props
}: NpmDiffClientProps) => {
    return (
        <>
            <HStack width="100%" justifyContent="space-between">
                <Span>
                    Showing <B>{props.files.length} changed files</B> with{" "}
                    <B>{additions} additions</B> and{" "}
                    <B>{deletions} deletions</B>
                </Span>
                <ViewTypeSwitch currentViewType={props.viewType} />
            </HStack>
            <DiffFiles {...props} />
        </>
    );
};

export default NpmDiffClient;
