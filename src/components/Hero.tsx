import { Flex, FlexProps } from "@chakra-ui/core";

export const Hero: React.FC<FlexProps> = ({ children, ...rest }) => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            height="100vh"
            direction="row"
            {...rest}
        >
            {children}
        </Flex>
    );
};

export default Hero;
