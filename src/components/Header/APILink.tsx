import { Link, LinkProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import NextLink from "^/components/theme/NextLink";

export const APILInk: FunctionComponent<LinkProps> = (props) => {
    const router = useRouter();

    return (
        <NextLink href="/about/api">
            <Link
                {...props}
                opacity={router.pathname == "/about/api" ? 0.4 : undefined}
                transition="all 0.2s"
                borderRadius="md"
                _focus={{
                    boxShadow: "outline",
                }}
            >
                about/api
            </Link>
        </NextLink>
    );
};
