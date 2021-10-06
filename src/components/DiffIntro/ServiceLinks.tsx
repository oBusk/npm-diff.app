import { FunctionComponent } from "react";
import { DiNpm } from "react-icons/di";
import { FaBox, FaCloud, FaRegFrownOpen } from "react-icons/fa";
import ServiceIcon from "./ServiceIcon";
import ServiceLink from "./ServiceLink";
import { serviceLinks } from "-/lib/serviceLinks";

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
            <ServiceIcon width="22px" height="22px" as={DiNpm} />
        </ServiceLink>

        <ServiceLink
            name="UNPKG"
            href={serviceLinks.UNPKG(packageName, packageVersion)}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <ServiceIcon as={FaCloud} />
        </ServiceLink>

        <ServiceLink
            name="Packagephobia"
            href={serviceLinks.Packagephobia(packageName, packageVersion)}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <ServiceIcon as={FaBox} />
        </ServiceLink>

        <ServiceLink
            name="Bundlephobia"
            href={serviceLinks.Bundlephobia(packageName, packageVersion)}
            packageName={packageName}
            packageVersion={packageVersion}
        >
            <ServiceIcon as={FaRegFrownOpen} />
        </ServiceLink>
    </>
);

export default ServiceLinks;
