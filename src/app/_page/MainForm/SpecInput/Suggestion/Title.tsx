import { ElementRef, forwardRef, memo } from "react";
import Heading, { HeadingProps } from "^/components/ui/Heading";
import cn from "^/lib/cn";
import emphasized from "./emphasized";

interface TitleProps extends HeadingProps {
    name?: string;
    version?: string;
}

const Title = forwardRef<ElementRef<typeof Heading>, TitleProps>(
    ({ name, version, className, ...props }, ref) => (
        <Heading
            variant="h3"
            className={cn(
                "font-mono font-normal",
                "text-sm sm:text-sm md:text-sm lg:text-sm",
                className,
            )}
            {...props}
            ref={ref}
        >
            {version ? (
                <>
                    <span className={cn("opacity-30")}>{name}@</span>
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
