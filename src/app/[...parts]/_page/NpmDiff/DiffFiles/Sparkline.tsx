import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface SparklineProps extends HTMLAttributes<HTMLSpanElement> {
    additions: number;
    deletions: number;
}

const BLOCKS = 5;

const Sparkline = forwardRef<HTMLSpanElement, SparklineProps>(
    ({ additions, deletions, className, ...props }, ref) => {
        const total = additions + deletions;

        if (total === 0) {
            return null;
        }

        const addBlocks = Math.min(
            BLOCKS,
            Math.max(1, Math.round((additions / total) * BLOCKS)),
        );

        return (
            <span
                className={cx("inline-flex shrink-0 gap-px", className!)}
                aria-hidden="true"
                ref={ref}
                {...props}
            >
                {Array.from({ length: BLOCKS }, (_, index) => (
                    <span
                        key={index}
                        className={cx(
                            "h-2.5 w-1 rounded-[1px]",
                            index < addBlocks ? "bg-add" : "bg-remove",
                        )}
                    />
                ))}
            </span>
        );
    },
);
Sparkline.displayName = "Sparkline";

export default Sparkline;
