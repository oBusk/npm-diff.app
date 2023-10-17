import { forwardRef, HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface ContentsProps extends HTMLAttributes<HTMLSpanElement> {}

const Contents = forwardRef<HTMLSpanElement, ContentsProps>(
    ({ className, ...props }, ref) => (
        <span className={cx("contents", className)} ref={ref} {...props} />
    ),
);
Contents.displayName = "Contents";

export default Contents;
