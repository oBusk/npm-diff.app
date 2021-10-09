import {
    chakra,
    Tooltip as ChakraTooltip,
    TooltipProps as ChakraTooltipProps,
} from "@chakra-ui/react";

export interface TooltipProps extends ChakraTooltipProps {}

const Tooltip = chakra(ChakraTooltip, {
    baseStyle: {
        maxWidth: "600px",
        padding: "4px",
    },
});

export default Tooltip;
