import { FunctionComponent, useContext } from "react";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
} from "^/lib/autocomplete";
import useAutocomplete from "^/lib/autocomplete/useAutocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import Combobox, { ComboboxProps } from "./Combobox";
import Suggestion from "./Suggestion";

export interface SpecInputProps
    extends Omit<ComboboxProps<AutocompleteSuggestion>, "items"> {
    versionSelected?: (item: AutocompleteSuggestion) => void;
    /**
     * If specified, `SpecInput` will try to find versions that matches this spec.
     *
     * If no matches are found, this filter is ignored.
     */
    optionalPackageFilter?: string;
}

const SpecInput: FunctionComponent<SpecInputProps> = ({
    id,
    versionSelected,
    optionalPackageFilter,
    inputValue,
    ...props
}) => {
    const fallback = useContext(FallbackSuggestionsContext);

    const { items, loading } = useAutocomplete({
        query: inputValue ?? "",
        queryThrottle: 250,
        fallback,
        optionalPackageFilter,
    });

    return (
        <Combobox
            width="100%"
            maxWidth="20em"
            id={id}
            inputValue={inputValue}
            label={null}
            items={items}
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
            isLoading={loading}
            {...props}
        />
    );
};

export default SpecInput;
