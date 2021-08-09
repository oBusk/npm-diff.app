import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    forwardRef,
    IconButton,
    IconButtonProps,
    InputRightElement,
} from "@chakra-ui/react";

const ComboboxButton = forwardRef<IconButtonProps, "button">((props, ref) => (
    <InputRightElement>
        <IconButton
            type="button"
            icon={<ArrowDownIcon />}
            ref={ref}
            {...props}
            size="sm"
        />
    </InputRightElement>
));

export default ComboboxButton;
