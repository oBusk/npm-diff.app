import {
    Code,
    CodeProps,
    forwardRef,
    useColorModeValue,
} from "@chakra-ui/react";

export type TooltipCodeProps = CodeProps;

/** Small wrapper for https://chakra-ui.com/code for better colors in Tooltip */
const TooltipCode = forwardRef<TooltipCodeProps, typeof Code>((props, ref) => {
    // Since the tooltip is dark in light mode and dark in light mode, we invert the colors
    // Looking at colors in https://github.com/chakra-ui/chakra-ui/blob/%40chakra-ui/react%401.8.3/packages/theme/src/components/badge.ts
    const bg = useColorModeValue("gray.200", "gray.700");
    const color = useColorModeValue("gray.800", "gray.200");

    return <Code bg={bg} color={color} {...props} ref={ref} />;
});

export default TooltipCode;
