import { AnchorHTMLAttributes, forwardRef } from "react";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const ExternalLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
    <a {...props} rel="noreferrer noopener" target="_blank" ref={ref} />
));
ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
