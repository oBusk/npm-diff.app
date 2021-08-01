import { Box, Flex, FlexProps, Heading } from "@chakra-ui/react";
import NextLink from "components/theme/NextLink";
import { FunctionComponent } from "react";
import { APILInk } from "./APILink";
import { GithubLink } from "./GithubLink";

export const Header: FunctionComponent<FlexProps> = (props) => (
    <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        position="sticky"
        top="0"
        width="100%"
        {...props}
    >
        <GithubLink />
        <NextLink href="/">
            <Box
                as="a"
                transition="all 0.2s"
                borderRadius="md"
                _focus={{
                    boxShadow: "outline",
                }}
            >
                <Heading as="h1">npm-diff.app 📦🔃</Heading>
            </Box>
        </NextLink>
        <APILInk />
    </Flex>
);
