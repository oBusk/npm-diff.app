import { HStack, Text } from "@chakra-ui/react";
import { type FunctionComponent } from "react";
import { type AutocompleteSuggestion } from "^/lib/autocomplete";
import Title from "./Title";
import VersionTag from "./VersionTag";

export interface SuggestionProps {
    item?: AutocompleteSuggestion;
    index?: number;
}

const Suggestion: FunctionComponent<SuggestionProps> = ({
    item: { name, body, tags = [], version } = {},
}) => (
    <>
        <Title name={name} version={version} />

        {body ? <Text fontSize="xs">{body}</Text> : null}
        <HStack marginTop="4px">
            {tags.map((tag) => (
                <VersionTag key={tag} value={tag} />
            ))}
        </HStack>
    </>
);

export default Suggestion;
