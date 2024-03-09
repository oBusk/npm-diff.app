import { forwardRef, Suspense } from "react";
import Skeleton from "^/components/ui/Skeleton";
import Stack from "^/components/ui/Stack";
import { DiffFilesSkeleton } from "./DiffFiles";
import { type NpmDiffProps } from "./NpmDiff";
import ViewTypeSwitch from "./ViewTypeSwitch";

const NpmDiffSkeleton = () => (
    <div>
        <Stack direction="h" className="w-full items-center justify-between">
            <Skeleton className="mt-1 h-2 w-64" />
            <Suspense>
                <ViewTypeSwitch />
            </Suspense>
        </Stack>
        <DiffFilesSkeleton />
    </div>
);
NpmDiffSkeleton.displayName = "NpmDiffSkeleton";

export default NpmDiffSkeleton;
