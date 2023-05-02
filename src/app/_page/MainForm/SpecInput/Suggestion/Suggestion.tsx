import { FunctionComponent } from "react";
import Stack from "^/components/ui/Stack";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
import cn from "^/lib/cn";
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

        {body ? <p className={cn("text-xs")}>{body}</p> : null}
        <Stack direction="h" className={cn("mt-1")}>
            {tags.map((tag) => (
                <VersionTag className={cn("text-gray-400")} key={tag}>
                    {tag}
                </VersionTag>
            ))}
        </Stack>
    </>
);

export default Suggestion;
