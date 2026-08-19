import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface LogoMarkProps extends HTMLAttributes<HTMLSpanElement> {}

const LogoMark = forwardRef<HTMLSpanElement, LogoMarkProps>(
    ({ className, ...props }, ref) => (
        <span
            className={cx(
                "flex size-7 shrink-0 overflow-hidden rounded-lg border border-line-strong bg-secondary",
                className!,
            )}
            aria-hidden="true"
            ref={ref}
            {...props}
        >
            <span className="flex flex-1 items-center justify-center border-r border-line-strong bg-[rgba(74,222,128,0.10)] font-mono text-sm font-semibold text-add">
                +
            </span>
            <span className="flex flex-1 items-center justify-center bg-[rgba(248,113,113,0.10)] font-mono text-sm font-semibold text-remove">
                −
            </span>
        </span>
    ),
);
LogoMark.displayName = "LogoMark";

export default LogoMark;
