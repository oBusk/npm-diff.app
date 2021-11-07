import { chakra, Code, HStack, Tag, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { AutocompleteSuggestion } from "^/lib/autocomplete";

const Em = chakra("em", {
    baseStyle: {
        fontStyle: "normal",
        fontWeight: "bold",
        textDecoration: "underline",
    },
});

const Emphasized: FunctionComponent<{ text?: string }> = ({
    text = "NO_TEXT",
}) => {
    const [before, rest] = text.split("<em>");
    if (rest == null) {
        // If there is no emphasis, just return the text
        return <>{text}</>;
    }
    const [em, after] = rest.split("</em>");

    return (
        <>
            {before}
            <Em>{em}</Em>
            {after}
        </>
    );
};

export interface SuggestionProps {
    item?: AutocompleteSuggestion;
    index?: number;
}

const Suggestion: FunctionComponent<SuggestionProps> = ({
    item: { title, body, titleWithHighlight, tags } = {},
}) => (
    <>
        <Code>
            <Emphasized text={titleWithHighlight ?? title} />
        </Code>

        {body && <Text>{body}</Text>}
        {tags && (
            <HStack marginTop="5px">
                {tags.map((tag) => (
                    <Tag key={tag} variant="outline">
                        <Emphasized text={tag} />
                    </Tag>
                ))}
            </HStack>
        )}
    </>
);

export default Suggestion;
