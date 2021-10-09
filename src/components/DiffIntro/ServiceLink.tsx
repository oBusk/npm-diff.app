import { IconProps, Link } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import ServiceTooltip from "./ServiceTooltip";

export interface ServiceLinkProps extends IconProps {
    name: string;
    href: string;
    packageName: string;
    packageVersion: string;
}

const ServiceLink: FunctionComponent<ServiceLinkProps> = ({
    name,
    href,
    packageName,
    packageVersion,
    children,
}) => (
    <ServiceTooltip
        serviceName={name}
        packageName={packageName}
        packageVersion={packageVersion}
    >
        <Link
            margin="0 2px"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
        >
            {children}
        </Link>
    </ServiceTooltip>
);

export default ServiceLink;
