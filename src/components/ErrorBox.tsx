import { Code, forwardRef, useColorModeValue } from "@chakra-ui/react";
import BorderBox, { BorderBoxProps } from "./theme/BorderBox";

export interface ErrorBoxProps extends BorderBoxProps {}

const ErrorBox = forwardRef<ErrorBoxProps, typeof BorderBox>((props, ref) => {
    const errorBackground = useColorModeValue("red.200", "red.700");

    return (
        <BorderBox
            as={Code}
            backgroundColor={errorBackground}
            {...props}
            ref={ref}
        />
    );
});

export default ErrorBox;
