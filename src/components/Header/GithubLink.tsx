import cn from "classnames";
import { HTMLProps } from "react";
import { DiGithubBadge } from "react-icons/di";

export const GithubLink: React.FC<HTMLProps<HTMLAnchorElement>> = (props) => (
    <a
        href="https://github.com/oBusk/package-diff"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Go to package-diff's Github Repo"
        className={cn([
            "outline-none",
            "transition-all",
            "duration-200",
            "rounded-md",
            "focus:shadow-outline",
        ])}
        {...props}
    >
        <DiGithubBadge className="h-8 w-8" color="current" />
    </a>
);
