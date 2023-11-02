import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, type FlexProps, forwardRef, IconButton } from "@chakra-ui/react";
import Tooltip from "../Tooltip";

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
            {...props}
            ref={ref}
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
