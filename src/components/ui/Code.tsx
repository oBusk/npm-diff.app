import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "^/lib/cva";

const codeVariants = cva("rounded-sm bg-muted text-sm", {
    variants: {
        variant: {
            inline: "inline-block p-0.5",
            block: "block whitespace-pre-wrap px-1.5 py-2",
        },
    },
    defaultVariants: {
        variant: "inline",
    },
});

export interface CodeProps
    extends HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof codeVariants> {}

const Code = forwardRef<HTMLElement, CodeProps>(
    ({ className, variant, ...props }, ref) => (
        <code
            className={codeVariants({ variant, className })}
            ref={ref}
            {...props}
        />
    ),
);
Code.displayName = "Code";

export default Code;
