import { Box, Link, LinkProps } from "@chakra-ui/core";
import { DiGithubBadge } from "react-icons/di";

export const GithubLink: React.FC<LinkProps> = (props) => (
    <Link
        href="https://github.com/oBusk/package-diff"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Go to package-diff's Github Repo"
        outline="0"
        transition="all 0.2s"
        borderRadius="md"
        _focus={{
            boxShadow: "outline",
        }}
        {...props}
    >
        <Box as={DiGithubBadge} size="8" color="current" />
    </Link>
);
