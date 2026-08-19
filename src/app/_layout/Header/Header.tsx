import Link from "next/link";
import { forwardRef, type HTMLAttributes, Suspense } from "react";
import { cx } from "^/lib/cva";
import ColorModeToggle from "./ColorModeToggle";
import GithubLink from "./GithubLink";
import LogoMark from "./LogoMark";
import MobileMenu from "./MobileMenu";
import NavLink, { NavLinkFallback } from "./NavLink";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const NAV_LINK_CLASS =
    "h-auto rounded-lg border-none px-3 py-1.5 text-sm font-normal text-secondary-foreground hover:text-foreground";

const Header = forwardRef<HTMLElement, HeaderProps>(
    ({ className, ...props }, ref) => (
        <nav
            className={cx(
                "sticky inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-3.5",
                className!,
            )}
            {...props}
            ref={ref}
        >
            <Link
                href="/"
                className="flex items-center gap-2.5 rounded-md transition-all duration-200 hover:no-underline focus:outline-hidden"
            >
                <LogoMark />
                <span className="font-mono text-base font-semibold tracking-[-0.01em]">
                    <span className="text-foreground">npm-diff</span>
                    <span className="text-muted-foreground">.app</span>
                </span>
            </Link>
            {/* Desktop menu - hidden on mobile */}
            <div className="hidden items-center gap-1 md:flex">
                <Suspense
                    fallback={
                        <>
                            <NavLinkFallback
                                href="/-/about"
                                className={NAV_LINK_CLASS}
                            >
                                About
                            </NavLinkFallback>
                            <NavLinkFallback
                                href="/-/about/api"
                                className={NAV_LINK_CLASS}
                            >
                                API
                            </NavLinkFallback>
                            <NavLinkFallback
                                href="/-/about/source-trust"
                                className={NAV_LINK_CLASS}
                            >
                                Trust
                            </NavLinkFallback>
                        </>
                    }
                >
                    <NavLink href="/-/about" className={NAV_LINK_CLASS}>
                        About
                    </NavLink>
                    <NavLink href="/-/about/api" className={NAV_LINK_CLASS}>
                        API
                    </NavLink>
                    <NavLink
                        href="/-/about/source-trust"
                        className={NAV_LINK_CLASS}
                    >
                        Trust
                    </NavLink>
                </Suspense>
                <span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
                <GithubLink />
                <ColorModeToggle />
            </div>
            {/* Mobile menu - shown on small screens */}
            <div className="flex items-center justify-end md:hidden">
                <MobileMenu />
            </div>
        </nav>
    ),
);
Header.displayName = "Header";

export default Header;
