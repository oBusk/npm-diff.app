import { Flex, FlexProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export const Hero: FunctionComponent<FlexProps> = ({ children, ...rest }) => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            flex="1"
            direction="row"
            {...rest}
        >
            {children}
        </Flex>
    );
};

export default Hero;
