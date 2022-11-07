import {
    Tooltip as ChakraTooltip,
    TooltipProps as ChakraTooltipProps,
    forwardRef,
} from "@chakra-ui/react";

export interface TooltipProps extends ChakraTooltipProps {}

const Tooltip = forwardRef<TooltipProps, "div">((props, ref) => (
    <ChakraTooltip hasArrow {...props} ref={ref} />
));

export default Tooltip;
