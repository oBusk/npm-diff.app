import CollapsableBorderBox from "^/components/CollapsableBorderBox";
import Skeleton from "^/components/ui/Skeleton";
import { cx } from "^/lib/cva";
import contentVisibility from "^/lib/utils/contentVisibility";
import { DiffFileHeaderSkeleton } from "./DiffFileHeader";

const FakeCodeRow = ({
    length,
    indent,
}: {
    length: number;
    indent: number;
}) => (
    <Skeleton
        className={cx("my-4", `ml-${indent * 8}`, "h-1", `w-${length * 4}`)}
    />
);

export default function DiffFileSkeleton() {
    return (
        <CollapsableBorderBox
            className={cx("my-4 text-base", contentVisibility("700px"))}
            header={<DiffFileHeaderSkeleton />}
        >
            <div className="border-y bg-muted p-2.5 text-base leading-7">
                <Skeleton className="my-1 h-1 w-40" />
            </div>
            <div className="pl-12">
                <FakeCodeRow length={8} indent={0} />
                <FakeCodeRow length={14} indent={0} />
                <FakeCodeRow length={10} indent={0} />
                <FakeCodeRow length={4} indent={1} />
                <FakeCodeRow length={8} indent={2} />
                <FakeCodeRow length={2} indent={1} />
                <FakeCodeRow length={4} indent={0} />
            </div>
        </CollapsableBorderBox>
    );
}
