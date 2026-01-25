"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import type { UrlObject } from "url";
import { buttonVariants } from "^/components/ui/Button";
import { cx } from "^/lib/cva";

export type NavLinkProps = ComponentPropsWithoutRef<typeof Link>;

function normalizePathname(path: string): string {
    if (!path) return "/";
    return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function hrefToPathname(href: LinkProps["href"]): string {
    if (typeof href === "string") {
        // Extract pathname from "/x?y=1#z" safely
        return new URL(href, "http://n").pathname;
    }
    return (href as UrlObject).pathname ?? "/";
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
    { href, className, ...props },
    ref,
) {
    const pathname = usePathname();

    const current = normalizePathname(pathname);
    const target = normalizePathname(hrefToPathname(href));

    const isActive = current === target;

    return (
        <Link
            ref={ref}
            href={href}
            className={cx(
                buttonVariants({ variant: "outline", size: "sm", isActive }),
                className,
            )}
            aria-current={isActive ? "page" : undefined}
            {...props}
        />
    );
});

export const NavLinkFallback = forwardRef<HTMLAnchorElement, NavLinkProps>(
    function NavLinkFallback({ href = "", className, ...props }, ref) {
        return (
            <Link
                href={href}
                className={cx(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    className,
                )}
                {...props}
                ref={ref}
            />
        );
    },
);

export default NavLink;
