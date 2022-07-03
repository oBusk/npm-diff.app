import { ButtonGroup, ButtonGroupProps, forwardRef } from "@chakra-ui/react";
import {
    BundlephobiaIcon,
    NpmIcon,
    PackagephobiaIcon,
    UNPKGIcon,
} from "^/components/icons";
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
                icon={<NpmIcon size="20" />}
            />

            <ServiceLink
                serviceName="UNPKG"
                packageName={packageName}
                packageVersion={packageVersion}
                serviceLink={serviceLinks.UNPKG}
                icon={<UNPKGIcon />}
            />

            <ServiceLink
                serviceName="Packagephobia"
                packageName={packageName}
                packageVersion={packageVersion}
                serviceLink={serviceLinks.Packagephobia}
                icon={<PackagephobiaIcon />}
            />

            <ServiceLink
                serviceName="Bundlephobia"
                packageName={packageName}
                packageVersion={packageVersion}
                serviceLink={serviceLinks.Bundlephobia}
                icon={<BundlephobiaIcon />}
            />
        </ButtonGroup>
    ),
);

export default ServiceLinks;
