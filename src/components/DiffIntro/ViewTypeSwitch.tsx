import {
    Button,
    ButtonGroup,
    ButtonGroupProps,
    ButtonProps,
    forwardRef,
} from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { ViewType } from "react-diff-view";
import DIFF_TYPE_PARAM_NAME from "^/DIFF_TYPE_PARAM_NAME";
import { NextLink } from "../theme";

export interface ViewTypeButtonProps extends ButtonProps {
    title: string;
    viewType: ViewType;
    currentViewType: ViewType;
}

const ViewTypeButton = forwardRef<ViewTypeButtonProps, typeof Button>(
    ({ viewType, title, currentViewType, ...props }, ref) => {
        const searchParams = useSearchParams();
        const pathname = usePathname();

        return (
            <NextLink
                href={{
                    pathname,
                    query: {
                        ...Object.fromEntries(searchParams.entries()),
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
    currentViewType: ViewType;
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
