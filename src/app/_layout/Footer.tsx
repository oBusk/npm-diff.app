import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
    ({ className, ...props }, ref) => (
        <footer
            className={cx("flex contain-content", className)}
            {...props}
            ref={ref}
        />
    ),
);
Footer.displayName = "Footer";

export default Footer;
