import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
    Button,
    Flex,
    FlexProps,
    forwardRef,
    Tooltip,
    useBoolean,
} from "@chakra-ui/react";
import BorderBox from "./BorderBox";

export interface CollapseBlockProps extends FlexProps {
    buttonContent: string;
    buttonLabel: string;
}

/**
 * Show a button that can be clicked and a box will be expanded.
 * `children` is shown in the expandable box.
 *
 * Use `buttonText` to set the text of the button and `buttonLabel`
 * to set the tooltip of the button
 */
const ButtonExpandBox = forwardRef<CollapseBlockProps, "div">(
    ({ buttonContent, buttonLabel, children, ...props }, ref) => {
        const [isExpanded, setExpanded] = useBoolean(false);

        return (
            <Flex
                margin="16px"
                direction="column"
                alignItems="center"
                {...props}
                ref={ref}
            >
                {isExpanded && (
                    <BorderBox overflow="auto">{children}</BorderBox>
                )}

                <Tooltip label={buttonLabel}>
                    <Button
                        variant="outline"
                        onClick={setExpanded.toggle}
                        leftIcon={<ChevronDownIcon />}
                        {...(isExpanded && {
                            leftIcon: <ChevronUpIcon />,
                            borderTopRadius: 0,
                            borderTopWidth: 0,
                        })}
                    >
                        {buttonContent}
                    </Button>
                </Tooltip>
            </Flex>
        );
    },
);

export default ButtonExpandBox;
