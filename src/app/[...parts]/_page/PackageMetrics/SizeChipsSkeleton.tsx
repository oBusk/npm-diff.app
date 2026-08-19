import { type ReactNode } from "react";
import MetricChipSkeleton from "./MetricChipSkeleton";

export interface SkeletonSizeRow {
    name: string;
}

export interface SizeChipsSkeletonProps {
    flags?: ReactNode;
    sizeRows: SkeletonSizeRow[];
}

const SizeChipsSkeleton = ({ flags, sizeRows }: SizeChipsSkeletonProps) => (
    <>
        {flags}
        {sizeRows.map(({ name }) => (
            <MetricChipSkeleton key={name} />
        ))}
    </>
);

export default SizeChipsSkeleton;
