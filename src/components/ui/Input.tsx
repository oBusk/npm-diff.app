import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, InputHTMLAttributes } from "react";
import cn from "^/lib/cn";

const inputVariants = cva(
    "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            ring: {
                true: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            },
        },
        defaultVariants: {
            ring: true,
        },
    },
);

export interface InputProps
    extends InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ring, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(inputVariants({ ring, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = "Input";

export default Input;
