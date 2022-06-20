import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    forwardRef,
    IconButton,
    IconButtonProps,
    InputRightElement,
} from "@chakra-ui/react";

export type ComboboxButtonProps = IconButtonProps;

const ComboboxButton = forwardRef<ComboboxButtonProps, "button">(
    (props, ref) => (
        <InputRightElement>
            <IconButton
                type="button"
                icon={<ArrowDownIcon />}
                ref={ref}
                {...props}
            />
        </InputRightElement>
    ),
);

export default ComboboxButton;
