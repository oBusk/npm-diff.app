import {
    chakra,
    Code,
    forwardRef,
    HStack,
    StackProps,
    Tag,
    TagLabel,
    TagLeftIcon,
    Text,
} from "@chakra-ui/react";
import Tooltip from "components/theme/Tooltip";
import { BundlephobiaResults } from "lib/bundlephobia";
import { ElementType, FunctionComponent, ReactNode } from "react";
import SideeffectIcon from "./assets/SideeffectIcon";
import TreeshakeIcon from "./assets/TreeshakeIcon";

export interface BundlephobiaFlagsProps extends StackProps {
    data: BundlephobiaResults;
}

const Flag: FunctionComponent<{
    label: string;
    icon: ElementType;
    a: {
        spec: string;
        status: boolean;
    };
    b: {
        spec: string;
        status: boolean;
    };
}> = ({
    label,
    icon,
    a: { spec: aSpec, status: was },
    b: { spec: bSpec, status: is },
    ...props
}) => {
    const status =
        is && was
            ? true
            : !is && !was
            ? false
            : is && !was
            ? "new"
            : // !is && was
              "removed";

    if (status === false) {
        return null;
    } else {
        let colorScheme: string | undefined;
        let tooltip: ReactNode;

        if (status === "new") {
            colorScheme = "green";
            tooltip = (
                <Text>
                    <Code>{aSpec}</Code> was not{" "}
                    <chakra.span whiteSpace="nowrap">{label}</chakra.span>, but{" "}
                    <Code>{bSpec}</Code> <chakra.b>is</chakra.b>
                </Text>
            );
        } else if (status === "removed") {
            colorScheme = "red";
            tooltip = (
                <Text>
                    <Code>{aSpec}</Code> was{" "}
                    <chakra.span whiteSpace="nowrap">{label}</chakra.span>, but{" "}
                    <Code>{bSpec}</Code> is <chakra.b>not</chakra.b>
                </Text>
            );
        } else {
            // status === true
            colorScheme = undefined;
            tooltip = (
                <Text>
                    <Code>{aSpec}</Code> and <Code>{bSpec}</Code>{" "}
                    <chakra.b>are</chakra.b> both{" "}
                    <chakra.span whiteSpace="nowrap">{label}</chakra.span>
                </Text>
            );
        }

        return (
            <Tooltip label={tooltip}>
                <Tag colorScheme={colorScheme} {...props} cursor="help">
                    <TagLeftIcon boxSize="16px" as={icon} fill="currentColor" />
                    <TagLabel>{label}</TagLabel>
                </Tag>
            </Tooltip>
        );
    }
};

const BundlephobiaFlags = forwardRef<BundlephobiaFlagsProps, "div">(
    ({ data: { a, b }, ...props }, ref) => {
        return (
            <HStack {...props} ref={ref}>
                {/* https://github.com/pastelsky/bundlephobia/blob/b4075b/pages/package/%5B...packageString%5D/ResultPage.js#L302-L304 */}
                <Flag
                    label="tree-shakable"
                    icon={TreeshakeIcon}
                    a={{
                        spec: `${a.name}@${a.version}`,
                        status: Boolean(
                            a.hasJSModule || a.hasJSNext || a.isModuleType,
                        ),
                    }}
                    b={{
                        spec: `${b.name}@${b.version}`,
                        status: Boolean(
                            b.hasJSModule || b.hasJSNext || b.isModuleType,
                        ),
                    }}
                />
                <Flag
                    label="side-effect free"
                    icon={SideeffectIcon}
                    a={{
                        spec: `${a.name}@${a.version}`,
                        status: !a.hasSideEffects,
                    }}
                    b={{
                        spec: `${b.name}@${b.version}`,
                        status: !b.hasSideEffects,
                    }}
                />
            </HStack>
        );
    },
);

export default BundlephobiaFlags;
