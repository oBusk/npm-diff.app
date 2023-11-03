import Link from "next/link";
import { forwardRef, type HTMLAttributes } from "react";
import Heading from "^/components/ui/Heading";
import { cx } from "^/lib/cva";
import ColorModeToggle from "./ColorModeToggle";
import GithubLink from "./GithubLink";
import NavLink from "./NavLink";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = forwardRef<HTMLElement, HeaderProps>(
    ({ className, ...props }, ref) => (
        <nav
            className={cx(
                "sticky inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-6",
                className,
            )}
            {...props}
            ref={ref}
        >
            <div className="flex items-center space-x-1">
                <GithubLink />
                <ColorModeToggle />
            </div>
            <Link
                href="/"
                className="block rounded-md transition-all duration-200 hover:no-underline focus:outline-none"
            >
                <Heading
                    h={1}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                >
                    npm-diff.app 📦🔃
                </Heading>
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
