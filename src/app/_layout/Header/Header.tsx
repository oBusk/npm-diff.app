import { Link } from "@chakra-ui/next-js";
import { Box, Flex, FlexProps, Heading, HStack } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import ColorModeToggle from "./ColorModeToggle";
import { GithubLink } from "./GithubLink";
import NavLink from "./NavLink";

const Header: FunctionComponent<FlexProps> = (props) => (
    <Flex
        as="nav"
        align="center"
        padding="1.5rem 0.5rem"
        position="sticky"
        top="0"
        left="0"
        right="0"
        zIndex="2"
        css={{ label: "Header", contain: "content" }}
        {...props}
    >
        <HStack flex="1 0 0px">
            <GithubLink variant="ghost" />
            <ColorModeToggle variant="ghost" />
        </HStack>
        <Box
            as={Link}
            href="/"
            transition="all 0.2s"
            borderRadius="md"
            _focus={{
                boxShadow: "outline",
            }}
            _hover={{
                textDecoration: "none",
            }}
        >
            <Heading as="h1" fontSize={{ base: "md", sm: "xl", lg: "3xl" }}>
                npm-diff.app 📦🔃
            </Heading>
        </Box>
        <Flex flex="1 0 0px" justifyContent="flex-end">
            <NavLink href="/about">about</NavLink>/
            <NavLink href="/about/api">api</NavLink>
        </Flex>
    </Flex>
);

export default Header;
