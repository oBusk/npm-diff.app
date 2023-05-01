import { Github } from "lucide-react";
import { FunctionComponent } from "react";
import ExternalLink from "^/components/ExternalLink";
import Tooltip from "^/components/Tooltip";
import { Button, ButtonProps } from "^/components/ui/button";

export interface GithubLinkProps extends Omit<ButtonProps, "aria-label"> {}

export const GithubLink: FunctionComponent<GithubLinkProps> = (props) => {
    const label = "View npm-diff.app on Github";
    return (
        <Tooltip label={label}>
            <Button variant="ghost" size="sm" asChild {...props}>
                <ExternalLink
                    href="https://github.com/oBusk/npm-diff.app"
                    aria-label={label}
                >
                    <Github />
                </ExternalLink>
            </Button>
        </Tooltip>
    );
};
