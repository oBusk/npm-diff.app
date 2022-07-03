import { forwardRef, IconButton, Link, LinkProps } from "@chakra-ui/react";
import ServiceIcon from "../ServiceIcon";
import ServiceTooltip from "./ServiceTooltip";

export interface ServiceLinkProps extends LinkProps {
    serviceName: string;
    packageName: string;
    packageVersion: string;
    serviceLink: (packageName: string, packageVersion: string) => string;
}

const ServiceLink = forwardRef<ServiceLinkProps, typeof IconButton>(
    (
        { serviceName, packageName, packageVersion, serviceLink, ...props },
        ref,
    ) => (
        <ServiceTooltip
            serviceName={serviceName}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <Link
                href={serviceLink(packageName, packageVersion)}
                rel="noopener noreferrer"
                target="_blank"
                padding="0.1em"
                {...props}
                ref={ref}
            >
                <ServiceIcon serviceName={serviceName} />
            </Link>
        </ServiceTooltip>
    ),
);

export default ServiceLink;
