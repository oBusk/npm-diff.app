import Link, { LinkProps } from "next/link";
import { FunctionComponent } from "react";

export interface NextLinkProps extends LinkProps {}

const NextLink: FunctionComponent<NextLinkProps> = ({ ...props }) => {
    return <Link passHref {...props} />;
};

export default NextLink;
