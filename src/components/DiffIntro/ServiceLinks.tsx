import { FunctionComponent } from "react";
import {
    BundlephobiaIcon,
    NpmIcon,
    PackagephobiaIcon,
    UNPKGIcon,
} from "^/components/icons";
import { serviceLinks } from "^/lib/serviceLinks";
import ServiceIcon from "./ServiceIcon";
import ServiceLink from "./ServiceLink";

export interface ServiceLinksProps {
    packageName: string;
    packageVersion: string;
}

const ServiceLinks: FunctionComponent<ServiceLinksProps> = ({
    packageName,
    packageVersion,
}) => (
    <>
        <ServiceLink
            name="npmjs.com"
            href={serviceLinks["npmjs.com"](packageName, packageVersion)}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <ServiceIcon width="22px" height="22px" as={NpmIcon} />
        </ServiceLink>

        <ServiceLink
            name="UNPKG"
            href={serviceLinks.UNPKG(packageName, packageVersion)}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <ServiceIcon as={UNPKGIcon} />
        </ServiceLink>

        <ServiceLink
            name="Packagephobia"
            href={serviceLinks.Packagephobia(packageName, packageVersion)}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <ServiceIcon as={PackagephobiaIcon} />
        </ServiceLink>

        <ServiceLink
            name="Bundlephobia"
            href={serviceLinks.Bundlephobia(packageName, packageVersion)}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <ServiceIcon as={BundlephobiaIcon} />
        </ServiceLink>
    </>
);

export default ServiceLinks;
