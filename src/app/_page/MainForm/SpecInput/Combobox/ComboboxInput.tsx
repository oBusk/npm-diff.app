import { forwardRef, Input, type InputProps } from "@chakra-ui/react";

export interface ComboboxInputProps extends InputProps {
    isOpen: boolean;
}

const ComboboxInput = forwardRef<ComboboxInputProps, "input">(
    ({ isOpen, ...props }, ref) => (
        <Input
            type="text"
            ref={ref}
            {...props}
            borderBottomRadius={isOpen ? 0 : undefined}
        />
    ),
);

export default ComboboxInput;
