import {
    forwardRef,
    ListProps,
    UnorderedList,
    useColorModeValue,
} from "@chakra-ui/react";

const ComboboxSuggestionList = forwardRef<ListProps, "ul">((props, ref) => {
    const background = useColorModeValue("white", "gray.700");

    return (
        <UnorderedList
            background={background}
            borderWidth={1}
            borderTopWidth={0}
            borderBottomRadius="lg"
            position="absolute"
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
    );
});

export default ComboboxSuggestionList;
