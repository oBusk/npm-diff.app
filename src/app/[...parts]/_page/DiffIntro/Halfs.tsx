import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "^/lib/cva";

export interface HalfsProps extends HTMLAttributes<HTMLElement> {
    left: ReactNode;
    center?: ReactNode;
    right: ReactNode;
}

const Halfs = forwardRef<HTMLElement, HalfsProps>(
    ({ left, center, right, className, ...props }, ref) => (
        <section className={cx("flex", className)} {...props} ref={ref}>
            <div className="flex flex-1 justify-end">
                {/* Left half */}
                {left}
            </div>
            {/* Center column */}
            {center}
            <div className="flex flex-1 justify-start">
                {/* Right half */}
                {right}
            </div>
        </section>
    ),
);
Halfs.displayName = "Halfs";

export default Halfs;
