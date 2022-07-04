import { Link, LinkProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { NextLink } from "^/components/theme";

export interface NavLinkProps extends LinkProps {
    href: string;
}

const NavLink: FunctionComponent<LinkProps> = ({
    href = "",
    children,
    ...props
}) => {
    const { asPath } = useRouter();
    const [isActive, setIsActive] = useState(false);

    useEffect(
        () =>
            setIsActive(
                asPath != null &&
                    location != null &&
                    new URL(href, location.href).pathname ===
                        new URL(asPath, location.href).pathname,
            ),
        [asPath],
    );

    return (
        <NextLink href={href}>
            <Link
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
        </NextLink>
    );
};

export default NavLink;
