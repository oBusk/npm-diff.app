import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "^/lib/cva";
import { Services } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import ServiceLink from "../DiffIntro/ServiceLink";
import PackageMetricsDates from "./PackageMetricsDates";

export interface PackageMetricsProps extends HTMLAttributes<HTMLElement> {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    children?: ReactNode;
}

const PackageMetrics = forwardRef<HTMLElement, PackageMetricsProps>(
    ({ a, b, children, className, ...props }, ref) => (
        <section
            className={cx("w-full rounded-xl border border-line", className!)}
            ref={ref}
            {...props}
        >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-t-xl border-b border-rule bg-card px-4 py-2.5">
                <span className="font-mono text-[11px] tracking-[0.12em] text-label uppercase">
                    Package metrics
                </span>
                <PackageMetricsDates
                    suspenseKey={`package-metrics-dates-${simplePackageSpecToString(a)}...${simplePackageSpecToString(b)}`}
                    a={a}
                    b={b}
                />
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-glyph uppercase">
                        Open on
                    </span>
                    <div className="flex items-center gap-1">
                        {Object.values(Services).map((service) => (
                            <ServiceLink
                                key={service.name}
                                service={service}
                                pkg={b}
                                className="flex size-6 items-center justify-center rounded-md border border-line p-0 hover:border-line-strong"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 p-4">{children}</div>
        </section>
    ),
);
PackageMetrics.displayName = "PackageMetrics";

export default PackageMetrics;
