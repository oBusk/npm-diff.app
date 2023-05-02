import { forwardRef, HTMLAttributes, memo } from "react";
import cn from "^/lib/cn";
import emphasized from "./emphasized";

interface VersionTagProps extends HTMLAttributes<HTMLDivElement> {
    children?: string;
}

const VersionTag = forwardRef<HTMLDivElement, VersionTagProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "rounded-md border border-current px-1.5 py-0.5 text-xs",
                    className,
                )}
                {...props}
                ref={ref}
            >
                {emphasized(children)}
            </div>
        );
    },
);
VersionTag.displayName = "VersionTag";

export default memo(VersionTag);
