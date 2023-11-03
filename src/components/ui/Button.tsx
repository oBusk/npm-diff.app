import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "^/lib/cva";

export const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                xs: "rounded-md p-1",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
            },
            isActive: {
                true: null,
                false: null,
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
        compoundVariants: [
            {
                variant: "outline",
                isActive: true,
                class: "bg-muted text-muted-foreground",
            },
        ],
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { variant, size, isActive, asChild = false, className, ...props },
        ref,
    ) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={buttonVariants({
                    variant,
                    size,
                    isActive,
                    className,
                })}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export default Button;
