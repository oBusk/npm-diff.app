import { forwardRef, IconButton, IconButtonProps } from "@chakra-ui/react";
import ServiceTooltip from "./ServiceTooltip";

export interface ServiceLinkProps extends Omit<IconButtonProps, "aria-label"> {
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
            <IconButton
                as="a"
                href={serviceLink(packageName, packageVersion)}
                rel="noopener noreferrer"
                target="_blank"
                aria-label={`View ${packageName}@${packageVersion} on ${serviceName}`}
                {...props}
                ref={ref}
            />
        </ServiceTooltip>
    ),
);

export default ServiceLink;
