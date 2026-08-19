"use client";

import Link from "next/link";
import {
    type ReadonlyURLSearchParams,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { type ComponentProps, type ElementRef, forwardRef } from "react";
import type { ViewType } from "react-diff-view";
import Button, { type ButtonProps } from "^/components/ui/Button";
import { cx } from "^/lib/cva";
import useViewType from "^/lib/utils/useViewType";
import { DIFF_TYPE_PARAM_NAME } from "../paramNames";

export interface ViewTypeButtonProps extends ButtonProps {
    currentViewType: ViewType;
    pathname: string | null;
    searchParams: ReadonlyURLSearchParams | null;
    viewType: ViewType;
}

const ViewTypeButton = forwardRef<
    ElementRef<typeof Button>,
    ViewTypeButtonProps
>(
    (
        {
            currentViewType,
            pathname,
            searchParams,
            viewType,
            children,
            className,
            ...props
        },
        ref,
    ) => (
        <Button
            variant="ghost"
            className={cx(
                "h-[26px] rounded-[7px] px-3.5 text-[13px] font-medium",
                currentViewType === viewType
                    ? "bg-accent text-foreground hover:bg-accent"
                    : "text-muted-foreground",
                className!,
            )}
            asChild
            {...props}
            ref={ref}
        >
            <Link
                href={{
                    pathname,
                    query: {
                        ...(searchParams &&
                            Object.fromEntries(searchParams.entries())),
                        [DIFF_TYPE_PARAM_NAME]: viewType,
                    },
                }}
                replace
                shallow
                prefetch={false}
            >
                {children}
            </Link>
        </Button>
    ),
);
ViewTypeButton.displayName = "ViewTypeButton";

export interface ViewTypeSwitchProps extends ComponentProps<"div"> {}

const ViewTypeSwitch = forwardRef<HTMLDivElement, ViewTypeSwitchProps>(
    (props, ref) => {
        const buttonProps = {
            currentViewType: useViewType(),
            searchParams: useSearchParams(),
            pathname: usePathname(),
        } satisfies Partial<ViewTypeButtonProps>;

        return (
            <div
                {...props}
                className={cx(
                    "inline-flex shrink-0 gap-0.5 rounded-[10px] border border-line bg-muted p-[3px]",
                    props.className!,
                )}
                ref={ref}
            >
                <ViewTypeButton viewType="split" {...buttonProps}>
                    Split
                </ViewTypeButton>
                <ViewTypeButton viewType="unified" {...buttonProps}>
                    Unified
                </ViewTypeButton>
            </div>
        );
    },
);
ViewTypeSwitch.displayName = "ViewTypeSwitch";

export default ViewTypeSwitch;
