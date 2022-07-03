import { forwardRef, IconButton, Link, LinkProps } from "@chakra-ui/react";
import { Service } from "^/lib/Services";
import ServiceIcon from "../ServiceIcon";
import ServiceTooltip from "./ServiceTooltip";

export interface ServiceLinkProps extends LinkProps {
    service: Service;
    packageName: string;
    packageVersion: string;
}

const ServiceLink = forwardRef<ServiceLinkProps, typeof IconButton>(
    ({ service, packageName, packageVersion, ...props }, ref) => (
        <ServiceTooltip
            serviceName={service.name}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <Link
                href={service.url(packageName, packageVersion)}
                rel="noopener noreferrer"
                target="_blank"
                padding="0.1em"
                {...props}
                ref={ref}
            >
                <ServiceIcon service={service} />
            </Link>
        </ServiceTooltip>
    ),
);

export default ServiceLink;
