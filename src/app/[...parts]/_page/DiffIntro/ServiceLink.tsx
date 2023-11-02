import {
    forwardRef,
    type IconButton,
    Link,
    type LinkProps,
} from "@chakra-ui/react";
import { type Service } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceIcon from "../ServiceIcon";
import ServiceTooltip from "./ServiceTooltip";

export interface ServiceLinkProps extends LinkProps {
    service: Service;
    pkg: SimplePackageSpec;
}

const ServiceLink = forwardRef<ServiceLinkProps, typeof IconButton>(
    ({ service, pkg, ...props }, ref) => (
        <ServiceTooltip serviceName={service.name} pkg={pkg}>
            <Link
                href={service.url(pkg)}
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
