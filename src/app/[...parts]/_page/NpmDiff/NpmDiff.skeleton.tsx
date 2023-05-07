import { ComponentProps, forwardRef, Suspense } from "react";
import Skeleton from "^/components/ui/Skeleton";
import Stack from "^/components/ui/Stack";
import { DiffFilesSkeleton } from "./DiffFiles";
import ViewTypeSwitch from "./ViewTypeSwitch";

export interface NpmDiffSkeletonProps extends ComponentProps<"div"> {}

const NpmDiffSkeleton = forwardRef<HTMLDivElement, NpmDiffSkeletonProps>(
    (props, ref) => (
        <div {...props} ref={ref}>
            <Stack direction="h" className="w-full justify-between">
                <Skeleton className="h-1 w-[400px]" />
                <Suspense>
                    <ViewTypeSwitch />
                </Suspense>
            </Stack>
            <DiffFilesSkeleton />
        </div>
    ),
);
NpmDiffSkeleton.displayName = "NpmDiffSkeleton";

export default NpmDiffSkeleton;
