import cn from "classnames";
import { HTMLAttributes } from "react";

export const Hero: React.FC<HTMLAttributes<HTMLDivElement>> = ({
    children,
    ...rest
}) => {
    return (
        <div
            className={cn(
                "flex",
                "flex-row",
                "flex-1",
                "justify-center",
                "items-center",
            )}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Hero;
