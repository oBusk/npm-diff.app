import { forwardRef, InputGroup, InputGroupProps } from "@chakra-ui/react";

const ComboboxBox = forwardRef<InputGroupProps, "div">((props, ref) => (
    <InputGroup size="lg" ref={ref} {...props} />
));

export default ComboboxBox;
