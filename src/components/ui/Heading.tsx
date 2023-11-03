import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    h?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, h = 2, ...props }, ref) => {
        const defaultSize = (
            {
                1: "text-4xl",
                2: "text-3xl",
                3: "text-2xl",
                4: "text-xl",
                5: "text-lg",
                6: "text-base",
            } as const
        )[h];

        const Comp = `h${h}` as const;
        return (
            <Comp
                className={cx("font-bold", defaultSize, className)}
                ref={ref}
                {...props}
            />
        );
    },
);
Heading.displayName = "Heading";

export default Heading;
