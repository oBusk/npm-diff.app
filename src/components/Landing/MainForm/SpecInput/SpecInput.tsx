import { FunctionComponent, RefObject, useContext, useMemo } from "react";
import Combobox, { ComboboxProps } from "^/components/Combobox";
import { ComboboxRef } from "^/components/Combobox/Combobox";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
    getAutocompleter,
} from "^/lib/autocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import Suggestion from "./Suggestion";

export interface SpecInputProps
    extends Omit<ComboboxProps<AutocompleteSuggestion>, "suggestionFinder"> {
    versionSelected?: (item: AutocompleteSuggestion) => void;
    comboboxRef?: RefObject<ComboboxRef>;
}

const SpecInput: FunctionComponent<SpecInputProps> = ({
    id,
    versionSelected,
    comboboxRef,
    ...props
}) => {
    const fallback = useContext(FallbackSuggestionsContext);
    const suggestionFinder = useMemo(
        () => getAutocompleter(fallback),
        [fallback],
    );

    return (
        <Combobox
            width="100%"
            maxWidth="20em"
            id={id}
            label={null}
            initialSuggestions={fallback}
            suggestionFinder={suggestionFinder}
            itemToString={(suggestion) => suggestion?.value || ""}
            renderItem={Suggestion}
            keepOpen={({ selectedItem }) =>
                // If it is package suggestion ("react" ➡ "react@") is selected, keep the input open to suggest version
                selectedItem?.type === AutocompleteSuggestionTypes.Package
            }
            onItemSelected={(item) => {
                item.type === AutocompleteSuggestionTypes.Version &&
                    versionSelected?.(item);
            }}
            comboboxRef={comboboxRef}
            {...props}
        />
    );
};

export default SpecInput;
