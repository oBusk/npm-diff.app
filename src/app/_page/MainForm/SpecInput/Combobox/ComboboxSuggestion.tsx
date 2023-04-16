import { forwardRef, ListItem, ListItemProps } from "@chakra-ui/react";

export interface ComboboxSuggestionProps extends ListItemProps {
    highlighted: boolean;
}

const ComboboxSuggestion = forwardRef<ComboboxSuggestionProps, "li">(
    ({ highlighted, ...props }, ref) => (
        <ListItem
            background={highlighted ? "gray.100" : undefined}
            _dark={{
                background: highlighted ? "gray.600" : undefined,
            }}
            padding="16px"
            ref={ref}
            {...props}
        />
    ),
);

export default ComboboxSuggestion;
