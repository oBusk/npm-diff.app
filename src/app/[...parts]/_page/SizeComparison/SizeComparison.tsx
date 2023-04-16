"use client";

import { Box, Flex, Heading, LinkProps, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import ExternalLink from "^/components/ExternalLink";
import Span from "^/components/Span";
import { Service, ServiceName, Services } from "^/lib/Services";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import { prettyByte } from "^/lib/utils/prettyByte";
import Halfs from "../DiffIntro/Halfs";
import ServiceTooltip from "../DiffIntro/ServiceTooltip";

function differance(a: number, b: number): ReactNode {
    const diff = a - b;

    if (diff < 0) {
        return ` (${diff})`;
    } else if (diff > 0) {
        return ` (+${diff})`;
    } else {
        return "";
    }
}

function byteDifferance(a: number, b: number): ReactNode {
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
        pkg: SimplePackageSpec;
        service: Service;
    }
> = ({ pkg, service, ...props }) => {
    return (
        <ServiceTooltip serviceName={service.name} pkg={pkg}>
            <ExternalLink
                borderRadius="lg"
                padding={COMMON_PADDING}
                href={service.url(pkg)}
                textAlign="center"
                _hover={{
                    textDecoration: "none",
                    background: "gray.100",
                }}
                _dark={{
                    _hover: {
                        background: "gray.700",
                    },
                }}
                {...props}
            />
        </ServiceTooltip>
    );
};

const SizeText: FunctionComponent<{
    bytes: number;
    color?: string;
    num?: number;
    baseBytes?: number;
}> = ({ bytes, color, baseBytes }) => (
    <Text>
        <Span color={color}>{prettyByte(bytes)}</Span>
        {baseBytes != null && baseBytes != 0 && (
            <Span as="small">{byteDifferance(baseBytes, bytes)}</Span>
        )}
    </Text>
);

const CountText: FunctionComponent<{
    count: number;
    baseCount?: number;
}> = ({ count, baseCount }) => (
    <Text>
        <Span>{count}</Span>
        {baseCount != null && baseCount != 0 && (
            <Span as="small">{differance(baseCount, count)}</Span>
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

export interface SizeComparisonProps {
    serviceName: ServiceName;
    flags?: ReactNode;
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    sizeRows: SizeComparisonRow[];
}

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "8px";

const SizeComparison = ({
    serviceName,
    flags,
    a,
    b,
    sizeRows,
}: SizeComparisonProps) => {
    const service = Services[serviceName];
    return (
        <>
            <Heading size="xs">{service.name}</Heading>
            {flags}
            <Halfs
                width="100%"
                left={
                    <LinkButton
                        padding={COMMON_PADDING}
                        service={service}
                        pkg={a}
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
                }
                center={
                    <Box padding={COMMON_PADDING} textAlign="center">
                        {sizeRows.map((sizeRow) => (
                            <Text key={sizeRow.name}>{sizeRow.name}</Text>
                        ))}
                    </Box>
                }
                right={
                    <Flex flex="1 0 0px" justifyContent="flex-start">
                        <LinkButton
                            padding={COMMON_PADDING}
                            service={service}
                            pkg={b}
                        >
                            {sizeRows.map(({ name, a, b }) => {
                                if (b.bytes != null) {
                                    return (
                                        <SizeText
                                            key={name}
                                            bytes={b.bytes}
                                            color={b.color}
                                            baseBytes={a.bytes}
                                        />
                                    );
                                } else if (b.count != null) {
                                    return (
                                        <CountText
                                            key={name}
                                            count={b.count}
                                            baseCount={a.count}
                                        />
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </LinkButton>
                    </Flex>
                }
            />
        </>
    );
};

export default SizeComparison;
