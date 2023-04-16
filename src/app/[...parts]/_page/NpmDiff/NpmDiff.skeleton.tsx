"use client";

import { Box, BoxProps, HStack, Skeleton } from "@chakra-ui/react";
import { Suspense } from "react";
import { DiffFilesSkeleton } from "./DiffFiles";
import ViewTypeSwitch from "./ViewTypeSwitch";

export interface NpmDiffSkeletonProps extends BoxProps {}

const NpmDiffSkeleton = (props: NpmDiffSkeletonProps) => {
    return (
        <Box {...props}>
            <HStack width="100%" justifyContent="space-between" {...props}>
                <Skeleton width={400} height="0.5rem" />
                <Suspense>
                    <ViewTypeSwitch />
                </Suspense>
            </HStack>
            <DiffFilesSkeleton />
        </Box>
    );
};

export default NpmDiffSkeleton;
