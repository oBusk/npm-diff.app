import {
    Button,
    ButtonGroup,
    ButtonGroupProps,
    ButtonProps,
    forwardRef,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { DiffProps } from "react-diff-view";
import { DIFF_TYPE_PARAM_NAME } from "^/pages/[...parts]";
import { NextLink } from "../theme";

export interface ViewTypeButtonProps extends ButtonProps {
    title: string;
    viewType: NonNullable<DiffProps["viewType"]>;
    currentViewType: NonNullable<DiffProps["viewType"]>;
}

const ViewTypeButton = forwardRef<ViewTypeButtonProps, typeof Button>(
    ({ viewType, title, currentViewType, ...props }, ref) => {
        const router = useRouter();

        return (
            <NextLink
                href={{
                    query: {
                        ...router.query,
                        [DIFF_TYPE_PARAM_NAME]: viewType,
                    },
                }}
                replace
                shallow
            >
                <Button
                    as="a"
                    isActive={currentViewType === viewType}
                    {...props}
                    ref={ref}
                >
                    {title}
                </Button>
            </NextLink>
        );
    },
);

export interface ViewTypeSwitchProps extends ButtonGroupProps {
    currentViewType: NonNullable<DiffProps["viewType"]>;
}

const ViewTypeSwitch = forwardRef<ViewTypeSwitchProps, typeof ButtonGroup>(
    ({ currentViewType, ...props }, ref) => {
        return (
            <ButtonGroup variant="outline" isAttached {...props} ref={ref}>
                <ViewTypeButton
                    viewType="split"
                    title="Split"
                    currentViewType={currentViewType}
                />
                <ViewTypeButton
                    viewType="unified"
                    title="Unified"
                    currentViewType={currentViewType}
                />
            </ButtonGroup>
        );
    },
);

export default ViewTypeSwitch;
