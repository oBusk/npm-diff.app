import { forwardRef, HTMLAttributes } from "react";
import Pkg from "^/components/ui/Pkg";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceLinks from "./ServiceLinks";

interface SpecBoxProps extends HTMLAttributes<HTMLElement> {
    pkg: SimplePackageSpec;
}

const SpecBox = forwardRef<HTMLElement, SpecBoxProps>(
    ({ pkg, ...props }, ref) => (
        <section {...props} ref={ref}>
            <Pkg pkg={pkg} />
            <div>
                <ServiceLinks pkg={pkg} />
            </div>
        </section>
    ),
);
SpecBox.displayName = "SpecBox";

export default SpecBox;
