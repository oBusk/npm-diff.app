import { FunctionComponent } from "react";
import Stack from "^/components/ui/Stack";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
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

        {body ? <p className="text-xs">{body}</p> : null}
        <Stack direction="h" className="mt-1">
            {tags.map((tag) => (
                <VersionTag key={tag}>{tag}</VersionTag>
            ))}
        </Stack>
    </>
);

export default Suggestion;
