import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface InputAddonProps extends HTMLAttributes<HTMLDivElement> {}

const CenterInputAddon = forwardRef<HTMLDivElement, InputAddonProps>(
    ({ className, ...props }, ref) => (
        <div
            className={cx(
                "h-10 items-center border bg-accent px-3 select-none",
                className,
            )}
            {...props}
            ref={ref}
        />
    ),
);
CenterInputAddon.displayName = "CenterInputAddon";

export default CenterInputAddon;
