import { ComponentProps } from "react";
import { cx } from "^/lib/cva";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    );
}

export default Skeleton;
