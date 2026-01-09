import { forwardRef, type HTMLAttributes } from "react";
import Pkg from "^/components/ui/Pkg";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import PublishDate from "./PublishDate";
import ServiceLinks from "./ServiceLinks";
import TrustBadge from "./TrustBadge";

interface SpecBoxProps extends HTMLAttributes<HTMLElement> {
    pkg: SimplePackageSpec;
    pkgClassName?: string;
}

const SpecBox = forwardRef<HTMLElement, SpecBoxProps>(
    ({ pkg, pkgClassName, ...props }, ref) => (
        <section {...props} ref={ref}>
            <Pkg pkg={pkg} className={cx("px-1", pkgClassName)} />
            <TrustBadge
                suspenseKey={"trustbadge-" + simplePackageSpecToString(pkg)}
                pkg={pkg}
                className="font-normal"
            />
            <PublishDate
                suspenseKey={"publishdate-" + simplePackageSpecToString(pkg)}
                pkg={pkg}
                className="font-normal"
            />
            <ServiceLinks pkg={pkg} />
        </section>
    ),
);
SpecBox.displayName = "SpecBox";

export default SpecBox;
