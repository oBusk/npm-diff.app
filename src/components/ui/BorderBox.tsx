import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface BorderBoxProps extends HTMLAttributes<HTMLElement> {}

/** Box with rounded corners and a border */
const BorderBox = forwardRef<HTMLElement, BorderBoxProps>(
    ({ className, ...props }, ref) => (
        <section
            className={cx("rounded-md border border-input p-4", className)}
            {...props}
            ref={ref}
        />
    ),
);
BorderBox.displayName = "BorderBox";

export default BorderBox;
