import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    Flex,
    FlexProps,
    forwardRef,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";

export interface CollapsableBorderBoxHeaderProps extends FlexProps {
    isExpanded: boolean;
    toggleIsExpanded: () => void;
}

const CollapsableBorderBoxHeader = forwardRef<
    CollapsableBorderBoxHeaderProps,
    "div"
>(({ isExpanded, toggleIsExpanded, title, children, ...props }, ref) => {
    const label = isExpanded ? "Collapse" : "Expand";

    return (
        <Flex
            borderBottomWidth={1}
            alignItems="center"
            padding="8px"
            ref={ref}
            {...props}
        >
            <Tooltip label={label}>
                <IconButton
                    onClick={() => toggleIsExpanded()}
                    aria-label={label}
                    size="sm"
                    icon={
                        isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
                    }
                    marginRight="10px"
                />
            </Tooltip>
            {children}
        </Flex>
    );
});

export default CollapsableBorderBoxHeader;
