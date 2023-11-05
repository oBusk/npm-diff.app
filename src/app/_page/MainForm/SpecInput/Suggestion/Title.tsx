import { type ElementRef, forwardRef, memo } from "react";
import Heading, { type HeadingProps } from "^/components/ui/Heading";
import { cx } from "^/lib/cva";
import emphasized from "./emphasized";

interface TitleProps extends HeadingProps {
    name?: string;
    version?: string;
}

const Title = forwardRef<ElementRef<typeof Heading>, TitleProps>(
    ({ name, version, className, ...props }, ref) => (
        <Heading
            h={3}
            className={cx("mb-1 font-mono text-sm font-normal", className)}
            {...props}
            ref={ref}
        >
            {version ? (
                <>
                    <span className="opacity-30">{name}@</span>
                    {emphasized(version)}
                </>
            ) : (
                emphasized(name)
            )}
        </Heading>
    ),
);
Title.displayName = "SuggestionTitle";

export default memo(Title);
