import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";

export type ComboboxWrapperProps = HTMLAttributes<HTMLDivElement>;

const ComboboxWrapper = forwardRef<HTMLDivElement, ComboboxWrapperProps>(
    ({ className, ...props }, ref) => (
        <div className={cn("relative", className)} {...props} ref={ref} />
    ),
);
ComboboxWrapper.displayName = "ComboboxWrapper";

export default ComboboxWrapper;
