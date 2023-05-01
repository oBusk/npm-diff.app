import { forwardRef } from "react";
import { cn } from "^/lib/utils";

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
    ({ className, ...props }, ref) => {
        return (
            <footer
                className={cn("bg-background flex contain-content", className)}
                {...props}
                ref={ref}
            />
        );
    },
);
Footer.displayName = "Footer";

export default Footer;
