import { Link } from "@chakra-ui/next-js";
import {
    Button,
    ButtonGroup,
    ButtonGroupProps,
    ButtonProps,
    forwardRef,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ViewType } from "react-diff-view";
import { DIFF_TYPE_PARAM_NAME } from "^/pages/[...parts]";

export interface ViewTypeButtonProps extends ButtonProps {
    title: string;
    viewType: ViewType;
    currentViewType: ViewType;
}

const ViewTypeButton = forwardRef<ViewTypeButtonProps, typeof Button>(
    ({ viewType, title, currentViewType, ...props }, ref) => {
        const router = useRouter();

        return (
            <Button
                as={Link}
                href={{
                    query: {
                        ...router.query,
                        [DIFF_TYPE_PARAM_NAME]: viewType,
                    },
                }}
                replace
                shallow
                isActive={currentViewType === viewType}
                _hover={{
                    textDecoration: "none",
                }}
                {...props}
                ref={ref}
            >
                {title}
            </Button>
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
