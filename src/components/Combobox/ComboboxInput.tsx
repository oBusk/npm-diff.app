import { forwardRef, Input, InputProps } from "@chakra-ui/react";

interface ComboboxInputProps extends InputProps {
    isOpen: boolean;
}

const ComboboxInput = forwardRef<ComboboxInputProps, "input">(
    ({ isOpen, ...props }, ref) => (
        <Input
            borderBottomRadius={isOpen ? "0" : undefined}
            ref={ref}
            {...props}
        />
    ),
);

export default ComboboxInput;
