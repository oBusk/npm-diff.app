import {
    Code,
    forwardRef,
    Text,
    Tooltip,
    TooltipProps,
    useColorModeValue,
} from "@chakra-ui/react";
import B from "^/components/theme/B";

export interface ServiceTooltipProps extends TooltipProps {
    packageName: string;
    packageVersion: string;
    serviceName: string;
}

const ServiceTooltip = forwardRef<ServiceTooltipProps, any>(
    ({ packageName, packageVersion, serviceName, ...props }, ref) => {
        // Since the tooltip is dark in light mode and dark in light mode, we invert the colors
        // Looking at colors in https://github.com/chakra-ui/chakra-ui/blob/%40chakra-ui/react%401.8.3/packages/theme/src/components/badge.ts
        const codeBg = useColorModeValue("gray.200", "gray.700");
        const codeColor = useColorModeValue("gray.800", "gray.200");

        return (
            <Tooltip
                textAlign="center"
                {...props}
                ref={ref}
                label={
                    <>
                        <Text whiteSpace="nowrap">
                            View{" "}
                            <Code bg={codeBg} color={codeColor}>
                                {packageName}@{packageVersion}
                            </Code>
                        </Text>
                        <Text>
                            on <B>{serviceName}</B>
                        </Text>
                    </>
                }
            />
        );
    },
);

export default ServiceTooltip;
