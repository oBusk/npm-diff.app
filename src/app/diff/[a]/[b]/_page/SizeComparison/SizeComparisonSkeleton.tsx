import { type ComponentProps, type ReactNode } from "react";
import Skeleton from "^/components/ui/Skeleton";
import { cx } from "^/lib/cva";
import { type ServiceName, Services } from "^/lib/Services";
import Halfs from "../DiffIntro/Halfs";
import SizeComparisonHeading from "./SizeComparisonHeading";

export interface SkeletonSizeRow {
    name: string;
    a: number;
    b: number;
}

export interface SizeComparisonSkeletonProps {
    serviceName: ServiceName;
    sizeRows: SkeletonSizeRow[];
    flags?: ReactNode;
}

const Side = ({ className, ...props }: ComponentProps<"div">) => (
    <div
        className={cx(
            "flex flex-col items-center justify-evenly",
            COMMON_PADDING,
            className,
        )}
        {...props}
    />
);

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "p-2";

const SizeComparisonSkeleton = ({
    serviceName,
    sizeRows,
    flags,
}: SizeComparisonSkeletonProps) => {
    const service = Services[serviceName];

    return (
        <>
            <SizeComparisonHeading>{service.name}</SizeComparisonHeading>
            {flags}
            <Halfs
                className="w-full"
                left={
                    <Side>
                        {sizeRows.map(({ name, a }) => (
                            <Skeleton
                                key={name}
                                style={{ width: `${a}px` }}
                                className="h-2"
                            />
                        ))}
                    </Side>
                }
                center={
                    <div className={cx(COMMON_PADDING, "text-center")}>
                        {sizeRows.map(({ name }) => (
                            <p key={name}>{name}</p>
                        ))}
                    </div>
                }
                right={
                    <Side>
                        {sizeRows.map(({ name, b }) => (
                            <Skeleton
                                key={name}
                                style={{ width: `${b}px` }}
                                className="h-2"
                            />
                        ))}
                    </Side>
                }
            ></Halfs>
        </>
    );
};

export default SizeComparisonSkeleton;
