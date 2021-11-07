import { chakra, Code, HStack, Tag, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { AutocompleteSuggestion } from "^/lib/autocomplete";

const SuggestionTitle = chakra(Code, {
    baseStyle: {
        // `npms` wraps the matching part of the package name with `<em>`.
        // The Italic looks a bit too discreet, so let's remove italic
        // and add underline instead.
        em: {
            fontStyle: "normal",
            textDecoration: "underline",
        },
    },
});

const SuggestionTag = chakra(Tag, {
    baseStyle: {
        em: {
            fontStyle: "normal",
            fontWeight: "bold",
        },
    },
});

export interface SuggestionProps {
    item?: AutocompleteSuggestion;
    index?: number;
}

const Suggestion: FunctionComponent<SuggestionProps> = ({
    item: { title, body, titleWithHighlight, tags } = {},
}) => (
    <>
        {titleWithHighlight ? (
            <SuggestionTitle
                dangerouslySetInnerHTML={{
                    __html: titleWithHighlight,
                }}
            ></SuggestionTitle>
        ) : (
            <SuggestionTitle>{title}</SuggestionTitle>
        )}

        {body && <Text>{body}</Text>}
        {tags && (
            <HStack marginTop="5px">
                {tags.map((tag) => (
                    <SuggestionTag
                        key={tag}
                        variant="outline"
                        dangerouslySetInnerHTML={{
                            __html: tag,
                        }}
                    />
                ))}
            </HStack>
        )}
    </>
);

export default Suggestion;
