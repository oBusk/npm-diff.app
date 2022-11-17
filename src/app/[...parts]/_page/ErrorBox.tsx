import { Code, forwardRef } from "@chakra-ui/react";
import BorderBox, { BorderBoxProps } from "^/components/BorderBox";

export interface ErrorBoxProps extends BorderBoxProps {}

const ErrorBox = forwardRef<ErrorBoxProps, typeof BorderBox>((props, ref) => {
    return (
        <BorderBox
            as={Code}
            backgroundColor="red.200"
            _dark={{
                backgroundColor: "red.700",
            }}
            {...props}
            ref={ref}
        />
    );
});

export default ErrorBox;
