import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "^/lib/cva";

const stackVariants = cva("flex", {
    variants: {
        direction: {
            v: "flex-col",
            h: "flex-row",
        },
        align: {
            start: "items-start",
            center: "items-center",
            end: "items-end",
        },
        justify: {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
            around: "justify-around",
            evenly: "justify-evenly",
        },
        gap: {
            8: "gap-8",
        },
    },
    defaultVariants: {
        direction: "v",
    },
});

export interface StackProps
    extends HTMLAttributes<HTMLElement>,
        VariantProps<typeof stackVariants> {}

const Stack = forwardRef<HTMLElement, StackProps>(
    ({ className, direction, align, justify, gap, ...props }, ref) => (
        <section
            className={stackVariants({
                className,
                direction,
                align,
                justify,
                gap,
            })}
            {...props}
            ref={ref}
        />
    ),
);
Stack.displayName = "Stack";

export default Stack;
