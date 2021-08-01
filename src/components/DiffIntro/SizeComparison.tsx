import {
    Box,
    chakra,
    Flex,
    FlexProps,
    forwardRef,
    Link,
    LinkProps,
    Text,
} from "@chakra-ui/react";
import ServiceTooltip from "components/ServiceTooltip";
import { serviceLinks } from "lib/serviceLinks";
import { prettyByte } from "lib/utils/prettyByte";
import { FunctionComponent, ReactNode } from "react";

function differance(a: number, b: number): ReactNode {
    const diff = b - a;

    if (diff < 0) {
        return ` (${prettyByte(diff)})`;
    } else if (diff > 0) {
        return ` (+${prettyByte(diff)})`;
    } else {
        return "";
    }
}

const LinkButton: FunctionComponent<
    LinkProps & {
        packageName: string;
        packageVersion: string;
        serviceName: string;
        serviceLink: (packageName: string, packageVersion: string) => string;
    }
> = ({ packageName, packageVersion, serviceName, serviceLink, ...props }) => (
    <ServiceTooltip
        serviceName={serviceName}
        packageName={packageName}
        packageVersion={packageVersion}
    >
        <Link
            rel="noreferrer noopener"
            target="_blank"
            borderRadius="lg"
            padding={COMMON_PADDING}
            href={serviceLink(packageName, packageVersion)}
            _hover={{
                textDecoration: "none",
                background: "gray.100",
            }}
            {...props}
        />
    </ServiceTooltip>
);

const SizeText: FunctionComponent<{
    bytes: number;
    color?: string;
    baseBytes?: number;
}> = ({ bytes, color, baseBytes }) => (
    <Text>
        <chakra.span color={color}>{prettyByte(bytes)}</chakra.span>
        {baseBytes != null && baseBytes != 0 && (
            <chakra.small>{differance(baseBytes, bytes)}</chakra.small>
        )}
    </Text>
);

export interface Size {
    bytes: number;
    color: string;
}

export interface SizeComparisonRow {
    /** Like "install" or "gzipped" */
    name: string;
    a: Size;
    b: Size;
}

export interface ComparedPackage {
    name: string;
    version: string;
}

export interface SizeComparisonProps extends FlexProps {
    a: ComparedPackage;
    b: ComparedPackage;
    sizeRows: SizeComparisonRow[];
    serviceName: string;
    serviceLink: (packageName: string, packageVersion: string) => string;
}

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "8px";

const SizeComparison = forwardRef<SizeComparisonProps, "div">(
    ({ a, b, sizeRows, serviceName, serviceLink, ...props }, ref) => (
        <Flex ref={ref} {...props}>
            <Flex flex="1 0 0px" justifyContent="end">
                <LinkButton
                    padding={COMMON_PADDING}
                    serviceName={serviceName}
                    serviceLink={serviceLink}
                    packageName={a.name}
                    packageVersion={a.version}
                >
                    {sizeRows.map((sizeRow) => (
                        <SizeText
                            key={sizeRow.name}
                            bytes={sizeRow.a.bytes}
                            color={sizeRow.a.color}
                        />
                    ))}
                </LinkButton>
            </Flex>
            <Box padding={COMMON_PADDING} textAlign="center">
                {sizeRows.map((sizeRow) => (
                    <Text key={sizeRow.name}>{sizeRow.name}</Text>
                ))}
            </Box>
            <Flex flex="1 0 0px" justifyContent="start">
                <LinkButton
                    padding={COMMON_PADDING}
                    serviceName={serviceName}
                    serviceLink={serviceLink}
                    packageName={b.name}
                    packageVersion={b.version}
                >
                    {sizeRows.map((sizeRow) => (
                        <SizeText
                            key={sizeRow.name}
                            bytes={sizeRow.b.bytes}
                            color={sizeRow.b.color}
                            baseBytes={sizeRow.a.bytes}
                        />
                    ))}
                </LinkButton>
            </Flex>
        </Flex>
    ),
);

export default SizeComparison;
