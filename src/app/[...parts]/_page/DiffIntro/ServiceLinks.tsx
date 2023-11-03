import { forwardRef, HTMLAttributes } from "react";
import { Services } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceLink from "./ServiceLink";

export interface ServiceLinksProps extends HTMLAttributes<HTMLDivElement> {
    pkg: SimplePackageSpec;
}

const ServiceLinks = forwardRef<HTMLDivElement, ServiceLinksProps>(
    ({ pkg, ...props }, ref) => (
        <div {...props} ref={ref}>
            {Object.values(Services).map((service) => (
                <ServiceLink key={service.name} service={service} pkg={pkg} />
            ))}
        </div>
    ),
);
ServiceLinks.displayName = "ServiceLinks";

export default ServiceLinks;
