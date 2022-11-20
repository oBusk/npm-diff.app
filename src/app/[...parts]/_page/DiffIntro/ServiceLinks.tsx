import { ButtonGroup, ButtonGroupProps, forwardRef } from "@chakra-ui/react";
import { Services } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceLink from "./ServiceLink";

export interface ServiceLinksProps extends ButtonGroupProps {
    pkg: SimplePackageSpec;
}

const ServiceLinks = forwardRef<ServiceLinksProps, typeof ButtonGroup>(
    ({ pkg, ...props }, ref) => (
        <ButtonGroup isAttached size="xs" variant="ghost" {...props} ref={ref}>
            {Services.map((service) => (
                <ServiceLink key={service.name} service={service} pkg={pkg} />
            ))}
        </ButtonGroup>
    ),
);

export default ServiceLinks;
