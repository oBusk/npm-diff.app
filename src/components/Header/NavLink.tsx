import { Link, LinkProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
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
        <NextLink href={href} prefetch={false}>
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
