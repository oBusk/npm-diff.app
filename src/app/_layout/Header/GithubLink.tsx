import { Github } from "lucide-react";
import { type ElementRef, forwardRef } from "react";
import ExternalLink, {
    type ExternalLinkProps,
} from "^/components/ExternalLink";
import { buttonVariants } from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";

export interface GithubLinkProps extends Omit<
    ExternalLinkProps,
    "aria-label"
> {}

const GithubLink = forwardRef<ElementRef<typeof ExternalLink>, GithubLinkProps>(
    ({ className, ...props }, ref) => {
        const label = "View npm-diff.app on Github";
        return (
            <Tooltip label={label}>
                <ExternalLink
                    className={buttonVariants({
                        className,
                        variant: "ghost",
                        size: "xs",
                    })}
                    aria-label={label}
                    href="https://github.com/oBusk/npm-diff.app"
                    {...props}
                    ref={ref}
                >
                    <Github />
                </ExternalLink>
            </Tooltip>
        );
    },
);
GithubLink.displayName = "GithubLink";

export default GithubLink;
