import { BoxProps, forwardRef, Box } from "@chakra-ui/react";

export interface BorderBoxProps extends BoxProps {}

/** Very simple box with rounded corners and a border */
const BorderBox = forwardRef<BorderBoxProps, "div">((props, ref) => (
    <Box
        borderWidth={1}
        borderRadius="lg"
        padding="16px"
        ref={ref}
        {...props}
    />
));

export default BorderBox;
