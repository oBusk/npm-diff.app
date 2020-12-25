import { Flex, FlexProps } from "@chakra-ui/react";

export const Hero: React.FC<FlexProps> = ({ children, ...rest }) => {
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
