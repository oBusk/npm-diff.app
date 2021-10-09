import { forwardRef, InputGroup, InputGroupProps } from "@chakra-ui/react";

export type ComboboxBoxProps = InputGroupProps;

const ComboboxBox = forwardRef<InputGroupProps, "div">((props, ref) => (
    <InputGroup size="md" ref={ref} {...props} />
));

export default ComboboxBox;
