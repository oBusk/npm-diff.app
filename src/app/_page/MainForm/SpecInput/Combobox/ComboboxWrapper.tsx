import { forwardRef, HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export type ComboboxWrapperProps = HTMLAttributes<HTMLDivElement>;

const ComboboxWrapper = forwardRef<HTMLDivElement, ComboboxWrapperProps>(
    ({ className, ...props }, ref) => (
        <div className={cx("relative", className)} {...props} ref={ref} />
    ),
);
ComboboxWrapper.displayName = "ComboboxWrapper";

export default ComboboxWrapper;
