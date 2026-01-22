import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "^/lib/cva";

const borderBoxVariants = cva("rounded-md border p-4", {
    variants: {
        variant: {
            default: "border-input",
            danger: "border-red-500/50 bg-red-500/5",
            warning: "border-yellow-500/50 bg-yellow-500/5",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface BorderBoxProps
    extends
        HTMLAttributes<HTMLElement>,
        VariantProps<typeof borderBoxVariants> {}

/** Box with rounded corners and a border */
const BorderBox = forwardRef<HTMLElement, BorderBoxProps>(
    ({ className, variant, ...props }, ref) => (
        <section
            className={borderBoxVariants({ variant, className })}
            {...props}
            ref={ref}
        />
    ),
);
BorderBox.displayName = "BorderBox";

export default BorderBox;
