import { AnchorHTMLAttributes, forwardRef } from "react";

export interface ExternalLinkProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
    (props, ref) => (
        <a {...props} rel="noreferrer noopener" target="_blank" ref={ref} />
    ),
);
ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
