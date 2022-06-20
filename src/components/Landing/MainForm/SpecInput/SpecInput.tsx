import { FunctionComponent, useContext, useEffect, useState } from "react";
import {
    autocomplete,
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
} from "^/lib/autocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import useAsyncState from "^/lib/hooks/useAsyncState";
import Combobox, { ComboboxProps } from "./Combobox";
import Suggestion from "./Suggestion";

export interface SpecInputProps
    extends Omit<
        ComboboxProps<AutocompleteSuggestion>,
        "updateQuery" | "items"
    > {
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
    ...props
}) => {
    const fallback = useContext(FallbackSuggestionsContext);
    const [query, setQuery] = useState("");
    const [items, setItems] = useAsyncState(fallback);

    useEffect(() => {
        setItems(
            query === ""
                ? fallback
                : autocomplete({ query, optionalPackageFilter }),
        );
    }, [fallback, query, optionalPackageFilter]);

    return (
        <Combobox
            width="100%"
            maxWidth="20em"
            id={id}
            label={null}
            items={items}
            updateQuery={setQuery}
            queryThrottle={250}
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
