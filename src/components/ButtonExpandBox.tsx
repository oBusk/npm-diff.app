"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { useBoolean } from "react-use";
import cn from "^/lib/cn";
import BorderBox from "./BorderBox";
import Button from "./ui/Button";
import Tooltip from "./ui/Tooltip";

export interface ButtonExpandBoxProps extends HTMLAttributes<HTMLElement> {
    buttonContent: ReactNode;
    buttonLabel: ReactNode;
}

/**
 * Show a button that can be clicked and a box will be expanded.
 * `children` is shown in the expandable box.
 *
 * Use `buttonText` to set the text of the button and `buttonLabel`
 * to set the tooltip of the button
 */
const ButtonExpandBox = forwardRef<HTMLElement, ButtonExpandBoxProps>(
    ({ buttonContent, buttonLabel, children, className, ...props }, ref) => {
        const [isExpanded, toggleExpanded] = useBoolean(false);
        const Icon = isExpanded ? ChevronUp : ChevronDown;

        return (
            <section
                className={cn("m-4 flex flex-col items-center", className)}
                {...props}
                ref={ref}
            >
                {isExpanded ? (
                    <BorderBox overflow="auto">{children}</BorderBox>
                ) : null}

                <Tooltip label={buttonLabel}>
                    <Button
                        variant="outline"
                        onClick={toggleExpanded}
                        className={cn(
                            isExpanded && "rounded-t-none border-t-0",
                        )}
                    >
                        <Icon className={cn("mr-0.5 h-4 w-4 ")} />{" "}
                        {buttonContent}
                    </Button>
                </Tooltip>
            </section>
        );
    },
);
ButtonExpandBox.displayName = "ButtonExpandBox";

export default ButtonExpandBox;
