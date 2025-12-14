"use client";

import * as Primitive from "@radix-ui/react-tooltip";
import {
    type ComponentProps,
    type ComponentPropsWithoutRef,
    type ElementRef,
    forwardRef,
    type ReactNode,
} from "react";
import { cx } from "^/lib/cva";

const TooltipProvider = (props: ComponentProps<typeof Primitive.Provider>) => (
    <Primitive.Provider
        delayDuration={250}
        skipDelayDuration={100}
        {...props}
    />
);
TooltipProvider.displayName = Primitive.Provider.displayName;

const TooltipRoot = Primitive.Root;

const TooltipTrigger = Primitive.Trigger;

const TooltipContent = forwardRef<
    ElementRef<typeof Primitive.Content>,
    ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <Primitive.Portal>
        <Primitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cx(
                "z-20 overflow-hidden",
                "px-3 py-1.5",
                "bg-popover text-popover-foreground",
                "rounded-md border text-sm shadow-md animate-in fade-in-50",
                "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
                className,
            )}
            {...props}
        />
    </Primitive.Portal>
));
TooltipContent.displayName = Primitive.Content.displayName;

export interface TooltipProps extends ComponentPropsWithoutRef<
    typeof TooltipTrigger
> {
    label: ReactNode | null;
}

const Tooltip = forwardRef<ElementRef<typeof TooltipTrigger>, TooltipProps>(
    ({ children, label, ...props }, ref) =>
        label ? (
            <TooltipRoot>
                <TooltipTrigger asChild {...props} ref={ref}>
                    {children}
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
            </TooltipRoot>
        ) : (
            <>{children}</>
        ),
);
Tooltip.displayName = "Tooltip";

export default Tooltip;
export { TooltipContent, TooltipProvider, TooltipTrigger };
