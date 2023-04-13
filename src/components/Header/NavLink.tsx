import { Link, LinkProps } from "@chakra-ui/next-js";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";

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
