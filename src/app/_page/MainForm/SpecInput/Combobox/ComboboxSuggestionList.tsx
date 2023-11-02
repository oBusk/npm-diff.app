import { forwardRef, type ListProps, UnorderedList } from "@chakra-ui/react";

export interface ComboboxSuggestionListProps extends ListProps {}

const ComboboxSuggestionList = forwardRef<ComboboxSuggestionListProps, "ul">(
    (props, ref) => (
        <UnorderedList
            background="white"
            _dark={{
                background: "gray.700",
            }}
            borderWidth={1}
            borderTopWidth={0}
            borderBottomRadius="lg"
            position="absolute"
            zIndex={1}
            styleType="none"
            margin={0}
            left={0}
            right={0}
            _empty={{
                visibility: "hidden",
            }}
            ref={ref}
            {...props}
        />
    ),
);

export default ComboboxSuggestionList;
