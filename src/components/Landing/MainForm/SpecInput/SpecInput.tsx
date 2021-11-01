import React, { FunctionComponent, useContext } from "react";
import Combobox, { ComboboxProps } from "^/components/Combobox";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
    getAutocompleter,
} from "^/lib/autocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import Suggestion from "./Suggestion";

export interface SpecInputProps
    extends Omit<ComboboxProps<AutocompleteSuggestion>, "suggestionFinder"> {
    versionSelected?: () => void;
    inputRef?: React.RefObject<HTMLInputElement>;
}

const SpecInput: FunctionComponent<SpecInputProps> = ({
    id,
    versionSelected,
    inputRef,
    ...props
}) => {
    const fallback = useContext(FallbackSuggestionsContext);

    return (
        <Combobox
            width="100%"
            maxWidth="20em"
            id={id}
            label={null}
            initialSuggestions={fallback}
            suggestionFinder={getAutocompleter(fallback)}
            itemToString={(suggestion) => suggestion?.value || ""}
            renderItem={Suggestion}
            keepOpen={({ selectedItem }) =>
                // If it is package suggestion ("react" ➡ "react@") is selected, keep the input open to suggest version
                selectedItem?.type === AutocompleteSuggestionTypes.Package
            }
            onItemSelected={({ type }) => {
                type === AutocompleteSuggestionTypes.Version &&
                    versionSelected?.();
            }}
            inputRef={inputRef}
            {...props}
        />
    );
};

export default SpecInput;
