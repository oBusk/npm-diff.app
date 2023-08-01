"use client";

import { Link } from "@chakra-ui/next-js";
import { LinkProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";

export interface NavLinkProps extends LinkProps {
    href: string;
}

const NavLink: FunctionComponent<NavLinkProps> = ({
    href = "",
    children,
    ...props
}) => {
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
            opacity={isActive ? 0.4 : undefined}
            transition="all 0.2s"
            borderRadius="md"
            _focus={{
                boxShadow: "outline",
            }}
            {...props}
        >
            {children}
        </Link>
    );
};

export default NavLink;
