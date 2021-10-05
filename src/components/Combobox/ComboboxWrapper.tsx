import { Box, BoxProps, forwardRef } from "@chakra-ui/react";

export type ComboboxWrapperProps = BoxProps;

const ComboboxWrapper = forwardRef<ComboboxWrapperProps, "div">(
    (props, ref) => <Box position="relative" ref={ref} {...props} />,
);

export default ComboboxWrapper;
