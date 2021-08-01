import { forwardRef, Link, LinkProps } from "@chakra-ui/react";

export interface ExternalLinkProps extends LinkProps {}

const ExternalLink = forwardRef<ExternalLinkProps, "a">((props, ref) => (
    <Link rel="noreferrer noopener" target="_blank" ref={ref} {...props} />
));

export default ExternalLink;
