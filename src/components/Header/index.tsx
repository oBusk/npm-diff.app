import { Flex, FlexProps, Heading } from "@chakra-ui/core";
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
        left="0"
        right="0"
        {...props}
    >
        <GithubLink />
        <Heading as="h1">package-diff 📦🔃</Heading>
        <div />
    </Flex>
);
