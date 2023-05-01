"use client";

import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnchorHTMLAttributes, forwardRef, useEffect, useState } from "react";
import cn from "^/lib/cn";

const navLinkVariants = cva(
    "block rounded-md transition-all duration-200 focus:outline-none",
    {
        variants: {
            isActive: {
                // 40% opacity
                true: "opacity-40",
            },
        },
    },
);

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
    ({ href = "", className, ...props }, ref) => {
        const asPath = usePathname();
        const [isActive, setIsActive] = useState(false);

        useEffect(() => {
            if (asPath != null && location != null) {
                setIsActive(
                    new URL(href, location.href).pathname ===
                        new URL(asPath, location.href).pathname,
                );
            }

            return () => {
                setIsActive(false);
            };
        }, [asPath, href]);

        return (
            <Link
                href={href}
                className={cn(navLinkVariants({ isActive, className }))}
                {...props}
                ref={ref}
            />
        );
    },
);
NavLink.displayName = "NavLink";

export default NavLink;
