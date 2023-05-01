"use client";

import { Github } from "lucide-react";
import { forwardRef } from "react";
import ExternalLink from "^/components/ExternalLink";
import Tooltip from "^/components/Tooltip";
import { Button, ButtonProps } from "^/components/ui/button";

export interface GithubLinkProps extends Omit<ButtonProps, "aria-label"> {}

const GithubLink = forwardRef<HTMLButtonElement, GithubLinkProps>(
    ({ ...props }, ref) => {
        const label = "View npm-diff.app on Github";
        return (
            <Tooltip label={label}>
                <Button variant="ghost" size="sm" asChild {...props} ref={ref}>
                    <ExternalLink
                        href="https://github.com/oBusk/npm-diff.app"
                        aria-label={label}
                    >
                        <Github />
                    </ExternalLink>
                </Button>
            </Tooltip>
        );
    },
);
GithubLink.displayName = "GithubLink";

export default GithubLink;
