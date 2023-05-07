import { ElementRef, forwardRef } from "react";
import CollapsableBorderBox, {
    CollapsableBorderBoxProps,
} from "^/components/CollapsableBorderBox";
import Skeleton from "^/components/ui/Skeleton";
import { cx } from "^/lib/cva";
import contentVisibility from "^/lib/utils/contentVisibility";
import { DiffFileHeaderSkeleton } from "./DiffFileHeader";

export interface DiffFileSkeletonProps extends CollapsableBorderBoxProps {}

const DiffFileSkeleton = forwardRef<
    ElementRef<typeof CollapsableBorderBox>,
    DiffFileSkeletonProps
>(() => (
    <CollapsableBorderBox
        className={cx("my-4 text-base", contentVisibility("700px"))}
        header={<DiffFileHeaderSkeleton />}
    >
        <div className="border-y bg-muted">
            <Skeleton className="mb-2 ml-2 mt-4 inline-block  h-2 w-16 bg-muted-foreground" />
        </div>
        <div className="mx-4 flex flex-col">
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 h-2 w-32" />
            </div>
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 h-2 w-56" />
            </div>
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 h-2 w-40" />
            </div>
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 ml-4 h-2 w-32" />
            </div>
            <div className="h-6"></div>
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 ml-8 h-2 w-16" />
            </div>
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 ml-4 h-2 w-8" />
            </div>
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 ml-8 h-2 w-16" />
            </div>
            <div className="flex">
                <Skeleton className="my-2 mr-4 h-2 w-8" />
                <Skeleton className="my-2 h-2 w-16" />
            </div>
        </div>
    </CollapsableBorderBox>
));
DiffFileSkeleton.displayName = "DiffFileSkeleton";

export default DiffFileSkeleton;
