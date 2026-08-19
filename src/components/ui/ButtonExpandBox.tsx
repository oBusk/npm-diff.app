"use client";

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

    return (
        <Stack className={cx("relative", className!)} {...props} ref={ref}>
            <Tooltip label={buttonLabel}>
                <Button
                    variant="outline"
                    onClick={toggleExpanded}
                    className="h-8 gap-1.5 rounded-lg border-line px-2.5 text-[13px] font-normal text-muted-foreground"
                >
                    {buttonContent}
                </Button>
            </Tooltip>
            {isExpanded ? (
                <BorderBox className="absolute bottom-full left-0 z-10 mb-2 w-72 overflow-auto rounded-lg border-line bg-card shadow-xl">
                    {children}
                </BorderBox>
            ) : null}
        </Stack>
    );
});
ButtonExpandBox.displayName = "ButtonExpandBox";

export default ButtonExpandBox;
