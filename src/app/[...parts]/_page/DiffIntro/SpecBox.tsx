import { forwardRef, type HTMLAttributes } from "react";
import Pkg from "^/components/ui/Pkg";
import Skeleton from "^/components/ui/Skeleton";
import { cx } from "^/lib/cva";
import { Services } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import PublishDate from "./PublishDate";
import ServiceLinks from "./ServiceLinks";

interface SpecBoxProps extends HTMLAttributes<HTMLElement> {
    pkg: SimplePackageSpec;
    pkgClassName?: string;
}

const SpecBox = forwardRef<HTMLElement, SpecBoxProps>(
    ({ pkg, pkgClassName, ...props }, ref) => (
        <section {...props} ref={ref}>
            <Pkg pkg={pkg} className={cx("px-1", pkgClassName!)} />
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

export const SpecBoxSkeleton = ({
    pkgClassName,
}: Pick<SpecBoxProps, "pkgClassName">) => (
    <section>
        <Skeleton className={cx("h-5 w-32", pkgClassName!)} />
        <div className="my-1 flex h-5 items-center justify-center">
            <Skeleton className="h-2 w-16" />
        </div>
        <div className="flex h-5 items-center justify-center gap-1">
            {Object.values(Services).map((service) => (
                <Skeleton key={service.name} className="size-4" />
            ))}
        </div>
    </section>
);

export default SpecBox;
