import { Link, LinkProps } from "@chakra-ui/next-js";
import {
    Button,
    ButtonGroup,
    ButtonGroupProps,
    ButtonProps,
    forwardRef,
} from "@chakra-ui/react";
import {
    ReadonlyURLSearchParams,
    usePathname,
    useSearchParams,
} from "next/navigation";
import type { ViewType } from "react-diff-view";
import useViewType from "^/lib/utils/useViewType";
import { DIFF_TYPE_PARAM_NAME } from "../paramNames";

export interface ViewTypeButtonProps
    extends Omit<ButtonProps, "as" | "isActive"> {
    currentViewType: ViewType;
    pathname: string | null;
    searchParams: ReadonlyURLSearchParams | null;
    viewType: ViewType;
}

const ViewTypeButton = forwardRef<ViewTypeButtonProps, typeof Button>(
    (
        {
            currentViewType,
            pathname,
            searchParams,
            viewType,
            children,
            ...props
        },
        ref,
    ) => (
        <Button
            isActive={currentViewType === viewType}
            _hover={{
                textDecoration: "none",
            }}
            as={Link}
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
            {...props}
            ref={ref}
        >
            {children}
        </Button>
    ),
);

export interface ViewTypeSwitchProps extends ButtonGroupProps {}

const ViewTypeSwitch = forwardRef<ViewTypeSwitchProps, typeof ButtonGroup>(
    (props, ref) => {
        const buttonProps = {
            currentViewType: useViewType(),
            searchParams: useSearchParams(),
            pathname: usePathname(),
        };

        return (
            <ButtonGroup variant="outline" isAttached {...props} ref={ref}>
                <ViewTypeButton viewType="split" title="Split" {...buttonProps}>
                    Split
                </ViewTypeButton>
                <ViewTypeButton viewType="unified" {...buttonProps}>
                    Unified
                </ViewTypeButton>
            </ButtonGroup>
        );
    },
);

export default ViewTypeSwitch;
