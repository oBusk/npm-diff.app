import {
    Tooltip as ChakraTooltip,
    TooltipProps as ChakraTooltipProps,
    forwardRef,
} from "@chakra-ui/react";

export interface TooltipProps extends ChakraTooltipProps {}

const Tooltip = forwardRef<TooltipProps, any>((props, ref) => (
    <ChakraTooltip maxWidth="600px" padding="4px" ref={ref} {...props} />
));

export default Tooltip;
