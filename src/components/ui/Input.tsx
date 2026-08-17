import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "^/lib/cva";

const inputVariants = cva(
    "border-input ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden  disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            ring: {
                true: "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
            },
        },
        defaultVariants: {
            ring: true,
        },
    },
);

export interface InputProps
    extends
        InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ring, ...props }, ref) => {
        return (
            <input
                type={type}
                className={inputVariants({ ring, className })}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = "Input";

export default Input;
