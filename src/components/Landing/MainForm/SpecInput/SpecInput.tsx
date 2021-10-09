import React, { useContext } from "react";
import Combobox, { ComboboxProps } from "^/components/Combobox/Combobox";
import getAutocompleter from "^/lib/autocomplete";
import AutocompleteSuggestion from "^/lib/autocomplete/AutocompleteSuggestion";
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
            reopenOnClose={({ inputValue }) =>
                inputValue?.endsWith("@") || false
            }
            {...props}
        />
    );
};

export default SpecInput;
