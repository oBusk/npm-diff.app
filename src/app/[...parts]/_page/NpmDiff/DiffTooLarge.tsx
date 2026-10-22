import { type ComponentProps, forwardRef } from "react";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Pkg from "^/components/ui/Pkg";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";

export interface DiffTooLargeProps extends ComponentProps<"section"> {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
}

const DiffTooLarge = forwardRef<HTMLElement, DiffTooLargeProps>(
    ({ a, b, specs, className, ...props }, ref) => (
        <section
            className={cx("p-12 text-center", className!)}
            ref={ref}
            {...props}
        >
            <p className="text-4xl">📦🐘</p>
            <Heading h={3} className="mb-4">
                This diff is too large!
            </Heading>
            <p className="mb-4">
                Comparing <Pkg pkg={a} /> and <Pkg pkg={b} /> took too long. You
                can run it locally instead:
            </p>
            <Code>
                npm diff --diff={specs[0]} --diff={specs[1]}
            </Code>
        </section>
    ),
);
DiffTooLarge.displayName = "DiffTooLarge";

export default DiffTooLarge;
