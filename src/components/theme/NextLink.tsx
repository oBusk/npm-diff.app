import Link, { LinkProps } from "next/link";
import { FunctionComponent, PropsWithChildren } from "react";

export interface NextLinkProps extends LinkProps {}

const NextLink: FunctionComponent<PropsWithChildren<NextLinkProps>> = ({
    ...props
}) => {
    return <Link passHref {...props} />;
};

export default NextLink;
