import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface IntroProps extends HTMLAttributes<HTMLElement> {}

const Intro = forwardRef<HTMLElement, IntroProps>(
    ({ className, ...props }, ref) => (
        <section
            className={cx(
                "mx-auto flex max-w-165 flex-col items-center gap-3.5 text-center",
                className!,
            )}
            ref={ref}
            {...props}
        >
            <span className="font-mono text-[11px] tracking-[0.14em] text-info uppercase">
                npm diff, in the browser
            </span>
            {/* eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value -- the bare `leading-1.08` form doesn't apply a line-height at all (confirmed via computed style); only this bracketed form does */}
            <h1 className="text-[44px] leading-[1.08] font-semibold tracking-[-0.02em] text-balance">
                Compare any two versions of an npm package
            </h1>
            <p className="max-w-130 text-base leading-6 text-muted-foreground">
                File-level diffs, install and bundle size deltas, and provenance
                for both releases — no install, no clone.
            </p>
        </section>
    ),
);
Intro.displayName = "Intro";

export default Intro;
