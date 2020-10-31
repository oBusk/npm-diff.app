import cn from "classnames";
import Link from "next/link";
import { HTMLProps } from "react";
import { APILInk } from "./APILink";
import { GithubLink } from "./GithubLink";

export type Props = HTMLProps<HTMLElement>;

export const Header: React.FC<Props> = ({ className, ...props }) => (
    <nav
        className={cn([
            className,
            "flex",
            "items-center",
            "justify-between",
            "flex-wrap",
            "p-6",
            "sticky",
            "top-0",
            "w-full",
        ])}
        {...props}
    >
        <GithubLink />
        <Link href="/">
            <a
                className={cn([
                    "transition-all",
                    "duration-200",
                    "rounded-md",
                    "focus:shadow-outline",
                ])}
            >
                <h1 className={cn(["text-4xl", "font-bold", "leading-tight"])}>
                    package-diff 📦🔃
                </h1>
            </a>
        </Link>
        <APILInk />
    </nav>
);
