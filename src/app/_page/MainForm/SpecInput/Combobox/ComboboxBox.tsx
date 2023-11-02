import { chakra, InputGroup, type InputGroupProps } from "@chakra-ui/react";

export type ComboboxBoxProps = InputGroupProps;

const ComboboxBox = chakra(InputGroup, {
    baseStyle: {
        size: "md",
    },
});

export default ComboboxBox;
