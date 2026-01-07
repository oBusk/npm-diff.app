import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";
import emphasized from "./emphasized";

interface VersionTagProps extends HTMLAttributes<HTMLDivElement> {
    children?: string;
}

const VersionTag = forwardRef<HTMLDivElement, VersionTagProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <div
                className={cx(
                    "rounded-md border border-current px-1.5 py-0.5 text-xs opacity-30",
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

export default VersionTag;
