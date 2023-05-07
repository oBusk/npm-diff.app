import { ComponentProps } from "react";
import { cx } from "^/lib/cva";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("rounded-md bg-muted animate-pulse", className)}
            {...props}
        />
    );
}

export default Skeleton;
