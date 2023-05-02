import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import cn from "^/lib/cn";

const headingVariants = cva("font-bold", {
    variants: {
        variant: {
            h1: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
            h2: "text-xl md:text-2xl lg:text-3xl",
            h3: "text-lg md:text-xl lg:text-2xl",
            h4: "text-lg lg:text-xl",
        },
    },
});

export interface HeadingProps
    extends HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof headingVariants> {}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, variant, ...props }, ref) => {
        variant ??= "h2";

        const Comp = variant;
        return (
            <Comp
                className={cn(headingVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Heading.displayName = "Heading";

export default Heading;
