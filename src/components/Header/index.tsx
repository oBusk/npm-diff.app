import { Box, Flex, FlexProps, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { APILInk } from "./APILink";
import { GithubLink } from "./GithubLink";

export type Props = FlexProps;

export const Header: React.FC<Props> = (props) => (
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
        <Link href="/" passHref>
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
        </Link>
        <APILInk />
    </Flex>
);
