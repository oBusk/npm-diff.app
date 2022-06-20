import { FunctionComponent, useContext } from "react";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
    useAutocompleter,
} from "^/lib/autocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import Combobox, { ComboboxProps } from "./Combobox";
import Suggestion from "./Suggestion";

export interface SpecInputProps
    extends Omit<ComboboxProps<AutocompleteSuggestion>, "suggestionFinder"> {
    versionSelected?: (item: AutocompleteSuggestion) => void;
}

const SpecInput: FunctionComponent<SpecInputProps> = ({
    id,
    versionSelected,
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
            suggestionFinder={useAutocompleter(fallback)}
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
            {...props}
        />
    );
};

export default SpecInput;
