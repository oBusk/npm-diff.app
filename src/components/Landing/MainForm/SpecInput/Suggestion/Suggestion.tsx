import { HStack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
import Title from "./Title";
import VersionTag from "./VersionTag";

export interface SuggestionProps {
    item?: AutocompleteSuggestion;
    index?: number;
}

const Suggestion: FunctionComponent<SuggestionProps> = ({
    item: { name, body, tags = [], version } = {},
}) => {
    return (
        <>
            <Title name={name} version={version} />

            {body && <Text fontSize="xs">{body}</Text>}
            <HStack marginTop="4px">
                {tags.map((tag) => (
                    <VersionTag key={tag} value={tag} />
                ))}
            </HStack>
        </>
    );
};

export default Suggestion;