import React, { useContext } from "react";
import Combobox, { ComboboxProps } from "^/components/Combobox/Combobox";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
    getAutocompleter,
} from "^/lib/autocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import Suggestion from "./Suggestion";

export interface SpecInputProps extends ComboboxProps<AutocompleteSuggestion> {}

const SpecInput = ({
    id,
    ...props
}: Omit<ComboboxProps<AutocompleteSuggestion>, "suggestionFinder">) => {
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
            {...props}
        />
    );
};

export default SpecInput;
