import { Code, CodeProps, forwardRef } from "@chakra-ui/react";

export interface TooltipCodeProps extends CodeProps {}

/** Small wrapper for https://chakra-ui.com/code for better colors in Tooltip */
const TooltipCode = forwardRef<TooltipCodeProps, typeof Code>((props, ref) => (
    // Since the tooltip is dark in light mode and dark in light mode, we invert the colors
    // Looking at colors in https://github.com/chakra-ui/chakra-ui/blob/%40chakra-ui/react%401.8.3/packages/theme/src/components/badge.ts
    <Code
        bg="gray.200"
        color="gray.800"
        _dark={{ bg: "gray.700", color: "gray.200" }}
        {...props}
        ref={ref}
    />
));

export default TooltipCode;
