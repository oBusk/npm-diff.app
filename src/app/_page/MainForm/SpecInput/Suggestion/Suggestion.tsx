import { type FunctionComponent } from "react";
import Stack from "^/components/ui/Stack";
import { type AutocompleteSuggestion } from "^/lib/autocomplete";
import Title from "./Title";
import VersionTag from "./VersionTag";

export interface SuggestionProps {
    item?: AutocompleteSuggestion;
    index?: number;
}

const Suggestion: FunctionComponent<SuggestionProps> = ({
    item: { name, body, tags = [], version, time } = {},
}) => (
    <>
        <Title name={name} version={version} />

        {body ? <p className="text-xs">{body}</p> : null}
        <Stack
            direction="h"
            className="mt-1 flex flex-wrap items-center gap-1 "
        >
            {time ? (
                <p className="mr-2 text-xs opacity-30">
                    {new Date(time).toLocaleDateString()}
                </p>
            ) : null}
            {tags.map((tag) => (
                <VersionTag key={tag}>{tag}</VersionTag>
            ))}
        </Stack>
    </>
);

export default Suggestion;
