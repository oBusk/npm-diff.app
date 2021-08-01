import { Box, Flex, FlexProps, Heading } from "@chakra-ui/react";
import NextLink from "components/theme/NextLink";
import { FunctionComponent } from "react";
import { APILInk } from "./APILink";
import { GithubLink } from "./GithubLink";

export const Header: FunctionComponent<FlexProps> = (props) => (
    <Flex
        as="nav"
        align="center"
        padding="1.5rem"
        position="sticky"
        top="0"
        left="0"
        right="0"
        {...props}
    >
        <Flex flex="1 0 0px" justifyContent="start">
            <GithubLink flex="1 0 0px" />
        </Flex>
        <NextLink href="/">
            <Box
                as="a"
                transition="all 0.2s"
                borderRadius="md"
                _focus={{
                    boxShadow: "outline",
                }}
            >
                <Heading as="h1" fontSize={{ base: "md", sm: "xl", lg: "3xl" }}>
                    npm-diff.app 📦🔃
                </Heading>
            </Box>
        </NextLink>
        <Flex flex="1 0 0px" justifyContent="end">
            <APILInk />
        </Flex>
    </Flex>
);
