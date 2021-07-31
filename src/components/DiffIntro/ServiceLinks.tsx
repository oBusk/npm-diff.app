import { FunctionComponent } from "react";
import { DiNpm } from "react-icons/di";
import { FaBox, FaCloud, FaRegFrownOpen } from "react-icons/fa";
import ServiceIcon from "./ServiceIcon";
import ServiceLink from "./ServiceLink";

export interface ServiceLinksProps {
    packageSpec: string;
}

const ServiceLinks: FunctionComponent<ServiceLinksProps> = ({
    packageSpec,
}) => {
    const [packageName, packageVersion] = packageSpec.split("@");

    return (
        <>
            <ServiceLink
                name="npmjs.com"
                href={`https://www.npmjs.com/package/${packageName}/v/${packageVersion}`}
                packageSpec={packageSpec}
            >
                <ServiceIcon width="22px" height="22px" as={DiNpm} />
            </ServiceLink>

            <ServiceLink
                name="UNPKG"
                href={`https://unpkg.com/${packageSpec}/`}
                packageSpec={packageSpec}
            >
                <ServiceIcon as={FaCloud} />
            </ServiceLink>

            <ServiceLink
                name="Packagephobia"
                href={`https://packagephobia.com/result?p=${packageSpec}`}
                packageSpec={packageSpec}
            >
                <ServiceIcon as={FaBox} />
            </ServiceLink>

            <ServiceLink
                name="Bundlephobia"
                href={`https://bundlephobia.com/package/${packageSpec}/`}
                packageSpec={packageSpec}
            >
                <ServiceIcon as={FaRegFrownOpen} />
            </ServiceLink>
        </>
    );
};

export default ServiceLinks;
