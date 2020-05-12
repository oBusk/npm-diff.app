import { Flex, FlexProps, Heading, PseudoBox } from "@chakra-ui/core";
import Link from "next/link";
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
            <PseudoBox
                as="a"
                transition="all 0.2s"
                borderRadius="md"
                _focus={{
                    boxShadow: "outline",
                }}
            >
                <Heading as="h1">package-diff 📦🔃</Heading>
            </PseudoBox>
        </Link>
        <div />
    </Flex>
);
