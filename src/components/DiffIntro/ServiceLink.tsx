import { Code, IconProps, Link, Text, Tooltip } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface ServiceLinkProps extends IconProps {
    name: string;
    href: string;
    packageSpec: string;
}

const ServiceLink: FunctionComponent<ServiceLinkProps> = ({
    name,
    href,
    packageSpec,
    children,
}) => (
    <Tooltip
        label={
            <>
                View <Code>{packageSpec}</Code> on <b>{name}</b>
            </>
        }
    >
        <Link
            margin="0 2px"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
        >
            {children}
        </Link>
    </Tooltip>
);

export default ServiceLink;
