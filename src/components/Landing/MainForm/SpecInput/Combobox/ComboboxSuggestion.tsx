import {
    forwardRef,
    ListItem,
    ListItemProps,
    useColorModeValue,
} from "@chakra-ui/react";

export interface ComboboxSuggestionProps extends ListItemProps {
    highlighted: boolean;
}

const ComboboxSuggestion = forwardRef<ComboboxSuggestionProps, "li">(
    ({ highlighted, ...props }, ref) => {
        const highlightColor = useColorModeValue("gray.100", "gray.600");

        return (
            <ListItem
                background={highlighted ? highlightColor : undefined}
                padding="16px"
                ref={ref}
                {...props}
            />
        );
    },
);

export default ComboboxSuggestion;
