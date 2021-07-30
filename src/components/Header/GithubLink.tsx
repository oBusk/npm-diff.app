import { Icon, Link, LinkProps, Tooltip } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { DiGithubBadge } from "react-icons/di";

export const GithubLink: FunctionComponent<LinkProps> = (props) => (
    <Tooltip
        label="View npm-diff.app on Github"
        aria-label="View npm-diff.app on Github"
    >
        <Link
            href="https://github.com/oBusk/npm-diff.app"
            rel="noopener noreferrer"
            target="_blank"
            outline="0"
            transition="all 0.2s"
            borderRadius="md"
            _focus={{
                boxShadow: "outline",
            }}
            {...props}
        >
            <Icon as={DiGithubBadge} boxSize="8" color="current" />
        </Link>
    </Tooltip>
);
