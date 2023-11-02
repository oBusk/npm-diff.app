import { Box, type BoxProps, chakra } from "@chakra-ui/react";

export type ComboboxWrapperProps = BoxProps;

const ComboboxWrapper = chakra(Box, {
    baseStyle: {
        position: "relative",
    },
});

export default ComboboxWrapper;
