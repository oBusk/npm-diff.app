import { type FunctionComponent } from "react";
import Skeleton from "^/components/ui/Skeleton";
import { cx } from "^/lib/cva";
import Halfs from "../DiffIntro/Halfs";

const COMMON_PADDING = "p-2";

export const TrustComparisonSkeleton: FunctionComponent = () => {
    return (
        <>
            <div className={cx("mb-2 text-center text-sm font-semibold")}>
                Trust Level
            </div>
            <Halfs
                className="w-full"
                left={
                    <div className={cx(COMMON_PADDING, "text-center")}>
                        <Skeleton className="mx-auto h-6 w-32" />
                    </div>
                }
                center={
                    <section className={cx(COMMON_PADDING, "text-center")}>
                        <p>Trust</p>
                    </section>
                }
                right={
                    <div className={cx(COMMON_PADDING, "text-center")}>
                        <Skeleton className="mx-auto h-6 w-32" />
                    </div>
                }
            />
        </>
    );
};

export { default } from "./TrustComparison";
