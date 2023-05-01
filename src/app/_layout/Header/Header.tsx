import Link from "next/link";
import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";
import ColorModeToggle from "./ColorModeToggle";
import GithubLink from "./GithubLink";
import NavLink from "./NavLink";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = forwardRef<HTMLElement, HeaderProps>(
    ({ className, ...props }, ref) => (
        <nav
            className={cn(
                "sticky inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-6",
                className,
            )}
            {...props}
            ref={ref}
        >
            <div className="flex items-center">
                <GithubLink variant="ghost" className="mr-4" />
                <ColorModeToggle variant="ghost" />
            </div>
            <Link
                href="/"
                className="block rounded-md transition-all duration-200 hover:no-underline focus:outline-none"
            >
                <h1 className="text-xl font-bold sm:text-2xl lg:text-4xl">
                    npm-diff.app 📦🔃
                </h1>
            </Link>
            <div className="flex items-center justify-end">
                <NavLink href="/about">about</NavLink>
                <span>/</span>
                <NavLink href="/about/api">api</NavLink>
            </div>
        </nav>
    ),
);
Header.displayName = "Header";

export default Header;
