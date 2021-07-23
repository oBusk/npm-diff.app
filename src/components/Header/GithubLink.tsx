import { Box, Link, LinkProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { DiGithubBadge } from "react-icons/di";

export const GithubLink: FunctionComponent<LinkProps> = (props) => (
    <Link
        href="https://github.com/oBusk/npm-diff.app"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Go to npm-diff.app's Github Repo"
        outline="0"
        transition="all 0.2s"
        borderRadius="md"
        _focus={{
            boxShadow: "outline",
        }}
        {...props}
    >
        <Box as={DiGithubBadge} boxSize="8" color="current" />
    </Link>
);
