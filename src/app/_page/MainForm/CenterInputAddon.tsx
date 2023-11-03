import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface InputAddonProps extends HTMLAttributes<HTMLDivElement> {}

const CenterInputAddon = forwardRef<HTMLDivElement, InputAddonProps>(
    ({ className, ...props }, ref) => (
        <div
            className={cx(
                "h-10 select-none items-center border bg-accent px-4",
                className,
            )}
            {...props}
            ref={ref}
        />
    ),
);
CenterInputAddon.displayName = "CenterInputAddon";

export default CenterInputAddon;
