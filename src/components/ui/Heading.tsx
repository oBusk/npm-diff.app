import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

const headingVariants = cva("font-bold", {
    variants: {
        variant: {
            h1: "text-4xl",
            h2: "text-3xl",
            h3: "text-2xl",
            h4: "text-xl",
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
                className={headingVariants({ variant, className })}
                ref={ref}
                {...props}
            />
        );
    },
);
Heading.displayName = "Heading";

export default Heading;
