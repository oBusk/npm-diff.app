import {
    ButtonGroup,
    type ButtonGroupProps,
    forwardRef,
} from "@chakra-ui/react";
import { Services } from "^/lib/Services";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import ServiceLink from "./ServiceLink";

export interface ServiceLinksProps extends ButtonGroupProps {
    pkg: SimplePackageSpec;
}

const ServiceLinks = forwardRef<ServiceLinksProps, typeof ButtonGroup>(
    ({ pkg, ...props }, ref) => (
        <ButtonGroup isAttached size="xs" variant="ghost" {...props} ref={ref}>
            {Object.values(Services).map((service) => (
                <ServiceLink key={service.name} service={service} pkg={pkg} />
            ))}
        </ButtonGroup>
    ),
);

export default ServiceLinks;
