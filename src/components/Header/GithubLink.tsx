import { IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { DiGithubBadge } from "react-icons/di";
import ExternalLink from "^/components/theme/ExternalLink";

export interface GithubLinkProps extends Omit<IconButtonProps, "aria-label"> {}

export const GithubLink: FunctionComponent<GithubLinkProps> = (props) => {
    const label = "View npm-diff.app on Github";
    return (
        <Tooltip label={label}>
            <IconButton
                as={ExternalLink}
                href="https://github.com/oBusk/npm-diff.app"
                aria-label={label}
                fontSize="1.75em"
                icon={<DiGithubBadge />}
                {...props}
            />
        </Tooltip>
    );
};
