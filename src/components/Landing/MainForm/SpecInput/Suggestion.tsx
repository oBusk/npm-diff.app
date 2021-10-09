import { chakra, Code, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import AutocompleteSuggestion from "^/lib/autocomplete/AutocompleteSuggestion";

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

export interface SuggestionProps {
    item?: AutocompleteSuggestion;
    index?: number;
}

const Suggestion: FunctionComponent<SuggestionProps> = ({
    item: { title, body, titleWithHighlight } = {},
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
    </>
);

export default Suggestion;
