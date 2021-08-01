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
            textAlign="center"
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
    num?: number;
    baseBytes?: number;
}> = ({ bytes, color, baseBytes }) => (
    <Text>
        <chakra.span color={color}>{prettyByte(bytes)}</chakra.span>
        {baseBytes != null && baseBytes != 0 && (
            <chakra.small>{differance(baseBytes, bytes)}</chakra.small>
        )}
    </Text>
);

const CountText: FunctionComponent<{
    count: number;
    baseCount?: number;
}> = ({ count, baseCount }) => (
    <Text>
        <chakra.span>{count}</chakra.span>
        {baseCount != null && baseCount != 0 && (
            <chakra.small>{differance(baseCount, count)}</chakra.small>
        )}
    </Text>
);

export interface Size {
    bytes?: number;
    count?: number;
    color?: string;
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
                    {sizeRows.map(({ name, a }) => {
                        if (a.bytes != null) {
                            return (
                                <SizeText
                                    key={name}
                                    bytes={a.bytes}
                                    color={a.color}
                                />
                            );
                        } else if (a.count != null) {
                            return <CountText key={name} count={a.count} />;
                        } else {
                            return null;
                        }
                    })}
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
                    {sizeRows.map(({ name, b }) => {
                        if (b.bytes != null) {
                            return (
                                <SizeText
                                    key={name}
                                    bytes={b.bytes}
                                    color={b.color}
                                />
                            );
                        } else if (b.count != null) {
                            return <CountText key={name} count={b.count} />;
                        } else {
                            return null;
                        }
                    })}
                </LinkButton>
            </Flex>
        </Flex>
    ),
);

export default SizeComparison;
