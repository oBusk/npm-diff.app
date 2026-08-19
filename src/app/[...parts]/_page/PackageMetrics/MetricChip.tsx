import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "^/lib/cva";

export interface MetricChipProps extends HTMLAttributes<HTMLSpanElement> {
    name: ReactNode;
    a: ReactNode;
    b: ReactNode;
    delta?: ReactNode;
}

const MetricChip = forwardRef<HTMLSpanElement, MetricChipProps>(
    ({ name, a, b, delta, className, ...props }, ref) => (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-lg border border-line bg-muted px-2.5 py-1.5 text-xs",
                className!,
            )}
            ref={ref}
            {...props}
        >
            <span className="text-label">{name}</span>
            <span className="font-mono text-code">
                {a} <span className="text-glyph">→</span> {b}
            </span>
            {delta != null && (
                <span className="font-mono text-[11.5px] text-muted-foreground">
                    {delta}
                </span>
            )}
        </span>
    ),
);
MetricChip.displayName = "MetricChip";

export default MetricChip;
