import {
    Tooltip as ChakraTooltip,
    type TooltipProps as ChakraTooltipProps,
    forwardRef,
} from "@chakra-ui/react";
import { FlipColorMode } from "./FlipColorMode";

export interface TooltipProps extends ChakraTooltipProps {}

const Tooltip = forwardRef<TooltipProps, "div">(({ label, ...props }, ref) => (
    <ChakraTooltip
        hasArrow
        label={<FlipColorMode>{label}</FlipColorMode>}
        {...props}
        ref={ref}
    />
));

export default Tooltip;
