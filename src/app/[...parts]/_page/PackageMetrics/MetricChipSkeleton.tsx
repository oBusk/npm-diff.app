import Skeleton from "^/components/ui/Skeleton";

export interface MetricChipSkeletonProps {
    width?: number;
}

const MetricChipSkeleton = ({ width = 120 }: MetricChipSkeletonProps) => (
    <span className="inline-flex items-center rounded-lg border border-line bg-muted px-2.5 py-1.5">
        <Skeleton className="h-3" style={{ width }} />
    </span>
);

export default MetricChipSkeleton;
