import { ComponentProps, forwardRef } from "react";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import { cx } from "^/lib/cva";
import SimplePackageSpec from "^/lib/SimplePackageSpec";

export interface NoDiffProps extends ComponentProps<"section"> {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
}

const NoDiff = forwardRef<HTMLElement, NoDiffProps>(
    ({ a, b, className, ...props }, ref) => (
        <section
            className={cx("p-12 text-center", className)}
            ref={ref}
            {...props}
        >
            <p className="text-4xl">📦🔃</p>
            <Heading h={3} className="mb-4">
                There&apos;s nothing to compare!
            </Heading>
            <Code>
                {a.name}@{a.version}
            </Code>{" "}
            and{" "}
            <Code>
                {b.name}@{b.version}
            </Code>{" "}
            are identical.
        </section>
    ),
);
NoDiff.displayName = "NoDiff";

export default NoDiff;
