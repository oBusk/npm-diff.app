import { Icon, Tooltip } from "@chakra-ui/react";
import ExternalLink, { ExternalLinkProps } from "components/theme/ExternalLink";
import { FunctionComponent } from "react";
import { DiGithubBadge } from "react-icons/di";

export interface GithubLinkProps extends ExternalLinkProps {}

export const GithubLink: FunctionComponent<GithubLinkProps> = (props) => (
    <Tooltip
        label="View npm-diff.app on Github"
        aria-label="View npm-diff.app on Github"
    >
        <ExternalLink
            href="https://github.com/oBusk/npm-diff.app"
            borderRadius="md"
            {...props}
        >
            <Icon as={DiGithubBadge} boxSize="8" color="current" />
        </ExternalLink>
    </Tooltip>
);
