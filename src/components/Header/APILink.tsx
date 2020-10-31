import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, HTMLProps } from "react";

export const APILInk: FunctionComponent<HTMLProps<HTMLAnchorElement>> = (
    props,
) => {
    const router = useRouter();

    return (
        <Link href="/about/api">
            <a
                {...props}
                className={cn([
                    router.pathname == "/about/api" ? "opacity-50" : null,
                    "transition-all",
                    "duration-200",
                    "rounded-md",
                    "focus:shadow-outline",
                ])}
            >
                about/api
            </a>
        </Link>
    );
};
