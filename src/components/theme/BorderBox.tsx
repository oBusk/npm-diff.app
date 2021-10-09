import { Box, BoxProps, chakra } from "@chakra-ui/react";

export interface BorderBoxProps extends BoxProps {}

/** Very simple box with rounded corners and a border */
const BorderBox = chakra(Box, {
    baseStyle: {
        borderWidth: 1,
        borderRadius: "lg",
        padding: "16px",
    },
});

export default BorderBox;
