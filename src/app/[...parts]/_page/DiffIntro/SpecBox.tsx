import { forwardRef, HTMLAttributes } from "react";
import Pkg from "^/components/ui/Pkg";
import { cx } from "^/lib/cva";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceLinks from "./ServiceLinks";

interface SpecBoxProps extends HTMLAttributes<HTMLElement> {
    pkg: SimplePackageSpec;
    pkgClassName?: string;
}

const SpecBox = forwardRef<HTMLElement, SpecBoxProps>(
    ({ pkg, pkgClassName, ...props }, ref) => (
        <section {...props} ref={ref}>
            <Pkg pkg={pkg} className={cx("px-1", pkgClassName)} />
            <div>
                <ServiceLinks pkg={pkg} />
            </div>
        </section>
    ),
);
SpecBox.displayName = "SpecBox";

export default SpecBox;
