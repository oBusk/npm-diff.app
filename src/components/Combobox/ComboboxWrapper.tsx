import { Box, BoxProps, forwardRef } from "@chakra-ui/react";

const ComboboxWrapper = forwardRef<BoxProps, "div">((props, ref) => (
    <Box position="relative" ref={ref} {...props} />
));

export default ComboboxWrapper;
