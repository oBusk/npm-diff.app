"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { type ElementRef, forwardRef, type ReactNode } from "react";
import { useBoolean } from "react-use";
import { cx } from "^/lib/cva";
import BorderBox from "./BorderBox";
import Button from "./Button";
import Stack, { type StackProps } from "./Stack";
import Tooltip from "./Tooltip";

export interface ButtonExpandBoxProps extends StackProps {
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
const ButtonExpandBox = forwardRef<
    ElementRef<typeof Stack>,
    ButtonExpandBoxProps
>(({ buttonContent, buttonLabel, children, className, ...props }, ref) => {
    const [isExpanded, toggleExpanded] = useBoolean(false);
    const Icon = isExpanded ? ChevronUp : ChevronDown;

    return (
        <Stack
            align="center"
            className={cx("m-4", className)}
            {...props}
            ref={ref}
        >
            {isExpanded ? (
                <BorderBox className="overflow-auto">{children}</BorderBox>
            ) : null}

            <Tooltip label={buttonLabel}>
                <Button
                    variant="outline"
                    onClick={toggleExpanded}
                    className={cx(isExpanded && "rounded-t-none border-t-0")}
                >
                    <Icon className="mr-0.5 size-4" /> {buttonContent}
                </Button>
            </Tooltip>
        </Stack>
    );
});
ButtonExpandBox.displayName = "ButtonExpandBox";

export default ButtonExpandBox;
