import { ButtonGroup, ButtonGroupProps, forwardRef } from "@chakra-ui/react";
import { Services } from "^/lib/Services";
import ServiceLink from "./ServiceLink";

export interface ServiceLinksProps extends ButtonGroupProps {
    packageName: string;
    packageVersion: string;
}

const ServiceLinks = forwardRef<ServiceLinksProps, typeof ButtonGroup>(
    ({ packageName, packageVersion, ...props }, ref) => (
        <ButtonGroup isAttached size="xs" variant="ghost" {...props} ref={ref}>
            {Services.map((service) => (
                <ServiceLink
                    key={service.name}
                    service={service}
                    packageName={packageName}
                    packageVersion={packageVersion}
                />
            ))}
        </ButtonGroup>
    ),
);

export default ServiceLinks;
