import { type FunctionComponent } from "react";
import ClientDate from "^/components/ClientDate";
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
                <ClientDate
                    className="mr-2 cursor-help text-xs opacity-30"
                    time={time}
                />
            ) : null}
            {tags.map((tag) => (
                <VersionTag key={tag}>{tag}</VersionTag>
            ))}
        </Stack>
    </>
);

export default Suggestion;
