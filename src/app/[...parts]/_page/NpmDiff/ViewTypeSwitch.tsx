"use client";

import Link from "next/link";
import {
    ReadonlyURLSearchParams,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { ComponentProps, ElementRef, forwardRef } from "react";
import type { ViewType } from "react-diff-view";
import Button, { ButtonProps } from "^/components/ui/Button";
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
            variant="outline"
            className={cx(
                "[&:not(:last-child)]:rounded-r-none",
                "[&:not(:last-child)]:border-r-0",
                "[&:not(:first-child)]:rounded-l-none",
                className,
            )}
            isActive={currentViewType === viewType}
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
            <div {...props} ref={ref}>
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
