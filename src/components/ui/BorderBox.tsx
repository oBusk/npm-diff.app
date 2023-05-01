import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";

export interface BorderBoxProps extends HTMLAttributes<HTMLElement> {}

/** Box with rounded corners and a border */
const BorderBox = forwardRef<HTMLElement, BorderBoxProps>(
    ({ className, ...props }, ref) => (
        <section
            className={cn("rounded-md border border-input p-4", className)}
            {...props}
            ref={ref}
        />
    ),
);
BorderBox.displayName = "BorderBox";

export default BorderBox;
