import { forwardRef, type HTMLAttributes } from "react";
import Pkg from "^/components/ui/Pkg";
import PkgWithVersionSelector from "^/components/ui/PkgWithVersionSelector";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import PublishDate from "./PublishDate";
import ServiceLinks from "./ServiceLinks";

interface SpecBoxProps extends HTMLAttributes<HTMLElement> {
    pkg: SimplePackageSpec;
    pkgClassName?: string;
    /** The other package spec (for interactive version selection) */
    otherPkg?: SimplePackageSpec;
    /** Which side this is ('a' or 'b') - required for version selection */
    side?: "a" | "b";
}

const SpecBox = forwardRef<HTMLElement, SpecBoxProps>(
    ({ pkg, pkgClassName, otherPkg, side, ...props }, ref) => (
        <section {...props} ref={ref}>
            {otherPkg && side ? (
                <PkgWithVersionSelector
                    pkg={pkg}
                    otherPkg={otherPkg}
                    side={side}
                    className={cx("px-1", pkgClassName)}
                />
            ) : (
                <Pkg pkg={pkg} className={cx("px-1", pkgClassName)} />
            )}
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
