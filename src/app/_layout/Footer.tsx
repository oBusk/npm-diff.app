import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";

interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
    ({ className, ...props }, ref) => (
        <footer
            className={cn("contain-content flex", className)}
            {...props}
            ref={ref}
        />
    ),
);
Footer.displayName = "Footer";

export default Footer;
