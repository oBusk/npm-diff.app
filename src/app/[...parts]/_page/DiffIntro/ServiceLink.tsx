import { ElementRef, forwardRef } from "react";
import ExternalLink, { ExternalLinkProps } from "^/components/ExternalLink";
import { cx } from "^/lib/cva";
import { Service } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceIcon from "../ServiceIcon";
import ServiceTooltip from "./ServiceTooltip";

export interface ServiceLinkProps extends Omit<ExternalLinkProps, "href"> {
    service: Service;
    pkg: SimplePackageSpec;
}

const ServiceLink = forwardRef<
    ElementRef<typeof ExternalLink>,
    ServiceLinkProps
>(({ service, pkg, className, ...props }, ref) => (
    <ServiceTooltip serviceName={service.name} pkg={pkg}>
        <ExternalLink
            href={service.url(pkg)}
            className={cx("inline-block p-[0.1em]", className)}
            {...props}
            ref={ref}
        >
            <ServiceIcon service={service} />
        </ExternalLink>
    </ServiceTooltip>
));
ServiceLink.displayName = "ServiceLink";

export default ServiceLink;
