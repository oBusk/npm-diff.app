import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";

export interface InputAddonProps extends HTMLAttributes<HTMLDivElement> {}

const CenterInputAddon = forwardRef<HTMLDivElement, InputAddonProps>(
    ({ className, ...props }, ref) => (
        <div
            className={cn("h-10 select-none border bg-accent p-2", className)}
            {...props}
            ref={ref}
        />
    ),
);
CenterInputAddon.displayName = "CenterInputAddon";

export default CenterInputAddon;
