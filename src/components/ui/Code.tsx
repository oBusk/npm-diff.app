import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";

export interface CodeProps extends HTMLAttributes<HTMLSpanElement> {}

const Code = forwardRef<HTMLElement, CodeProps>(
    ({ children, className, ...props }, ref) => (
        <code
            className={cn("rounded-sm bg-muted p-1", className)}
            ref={ref}
            {...props}
        >
            {children}
        </code>
    ),
);
Code.displayName = "Code";

export default Code;
