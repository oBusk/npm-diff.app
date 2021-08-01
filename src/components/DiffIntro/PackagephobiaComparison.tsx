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
import { PackagephobiaResults } from "lib/packagephobia";
import { PackagephobiaSize } from "lib/packagephobia/PackagephobiaResponse";
import { serviceLinks } from "lib/serviceLinks";
import { FunctionComponent, ReactNode } from "react";

export interface PackagephobiaComparisonProps extends FlexProps {
    packagephobiaResults: PackagephobiaResults;
}

function prettyByte(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    } else if (bytes < 1048576) {
        return `${(bytes / 1024).toFixed(2)} kB`;
    } else {
        return `${(bytes / 1048576).toFixed(2)} MB`;
    }
}

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

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "8px";

const SizeText: FunctionComponent<{
    size: PackagephobiaSize;
    baseSize?: PackagephobiaSize;
}> = ({
    size: { bytes, pretty, color },
    baseSize: { bytes: baseBytes } = {},
}) => (
    <Text>
        <chakra.span color={color}>{pretty}</chakra.span>
        {baseBytes != null && baseBytes != 0 && (
            <chakra.small>{differance(baseBytes, bytes)}</chakra.small>
        )}
    </Text>
);

const LinkButton: FunctionComponent<
    LinkProps & {
        packageName: string;
        packageVersion: string;
    }
> = ({ packageName, packageVersion, ...props }) => (
    <ServiceTooltip
        serviceName="Packagephobia"
        packageName={packageName}
        packageVersion={packageVersion}
    >
        <Link
            rel="noreferrer noopener"
            target="_blank"
            borderRadius="lg"
            padding={COMMON_PADDING}
            href={serviceLinks.Packagephobia(packageName, packageVersion)}
            _hover={{
                textDecoration: "none",
                background: "gray.100",
            }}
            {...props}
        />
    </ServiceTooltip>
);

const PackagephobiaComparison = forwardRef<PackagephobiaComparisonProps, "div">(
    ({ packagephobiaResults: { a, b }, ...props }, ref) => {
        return (
            <Flex ref={ref} {...props}>
                <Flex flex="1 0 0px" justifyContent="end">
                    {/* Left half */}
                    <LinkButton packageName={a.name} packageVersion={a.version}>
                        <SizeText size={a.publish} />
                        <SizeText size={a.install} />
                    </LinkButton>
                </Flex>
                <Box padding={COMMON_PADDING} textAlign="center">
                    <Text>Publish</Text>
                    <Text>Install</Text>
                </Box>
                <Flex flex="1 0 0px" justifyContent="start">
                    <LinkButton packageName={b.name} packageVersion={b.version}>
                        {/* Right half */}
                        <SizeText size={b.publish} baseSize={a.publish} />
                        <SizeText size={b.publish} baseSize={a.publish} />
                    </LinkButton>
                </Flex>
            </Flex>
        );
    },
);

export default PackagephobiaComparison;
