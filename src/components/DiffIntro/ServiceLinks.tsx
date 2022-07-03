import { ButtonGroup, ButtonGroupProps, forwardRef } from "@chakra-ui/react";
import { serviceLinks } from "^/lib/serviceLinks";
import ServiceLink from "./ServiceLink";

export interface ServiceLinksProps extends ButtonGroupProps {
    packageName: string;
    packageVersion: string;
}

const ServiceLinks = forwardRef<ServiceLinksProps, typeof ButtonGroup>(
    ({ packageName, packageVersion, ...props }, ref) => (
        <ButtonGroup isAttached size="xs" variant="ghost" {...props} ref={ref}>
            <ServiceLink
                serviceName="npmjs.com"
                packageName={packageName}
                packageVersion={packageVersion}
                serviceLink={serviceLinks["npmjs.com"]}
            />

            <ServiceLink
                serviceName="UNPKG"
                packageName={packageName}
                packageVersion={packageVersion}
                serviceLink={serviceLinks.UNPKG}
            />

            <ServiceLink
                serviceName="Packagephobia"
                packageName={packageName}
                packageVersion={packageVersion}
                serviceLink={serviceLinks.Packagephobia}
            />

            <ServiceLink
                serviceName="Bundlephobia"
                packageName={packageName}
                packageVersion={packageVersion}
                serviceLink={serviceLinks.Bundlephobia}
            />
        </ButtonGroup>
    ),
);

export default ServiceLinks;
