import { FunctionComponent, useContext } from "react";
import { useCallbackRef, useMergeRefs } from "use-callback-ref";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
} from "^/lib/autocomplete";
import useAutocomplete from "^/lib/autocomplete/useAutocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import useForceUpdate from "^/lib/hooks/useForceUpdate";
import Combobox, { ComboboxProps } from "./Combobox";
import { ComboboxRef } from "./Combobox/Combobox";
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
    comboboxRef,
    ...props
}) => {
    const update = useForceUpdate();
    const fallback = useContext(FallbackSuggestionsContext);
    const localRef = useCallbackRef<ComboboxRef | null>(null, update);
    const query = comboboxRef?.current?.value ?? "";

    const { items, isLoading } = useAutocomplete({
        query,
        queryThrottle: 250,
        fallback,
        optionalPackageFilter,
    });

    return (
        <Combobox
            width="100%"
            maxWidth="20em"
            id={id}
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
            isLoading={isLoading}
            comboboxRef={useMergeRefs(
                comboboxRef ? [comboboxRef, localRef] : [localRef],
            )}
            {...props}
        />
    );
};

export default SpecInput;
