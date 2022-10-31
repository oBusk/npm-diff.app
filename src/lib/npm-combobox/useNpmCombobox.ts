import { useCombobox } from "downshift";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
} from "../autocomplete";
import useAutocomplete from "../autocomplete/useAutocomplete";

export interface UseNpmComboboxProps {
    fallback: AutocompleteSuggestion[];

    id: string;
    initialIsOpen?: boolean | undefined;
    inputValue: string | undefined;
    onInputValueChange: (input: string | undefined) => void;
    /**
     *
     * If no matches are found, this filter is ignored.
     * If specified, `will try to find versions that matches this spec.
     */
    optionalPackageFilter?: string;
    versionSelected?: (item: AutocompleteSuggestion) => void;
}

export const useNpmCombobox = ({
    fallback,
    id,
    initialIsOpen = false,
    inputValue,
    onInputValueChange,
    optionalPackageFilter,
    versionSelected,
}: UseNpmComboboxProps) => {
    const { items, ...autocomplete } = useAutocomplete({
        query: inputValue ?? "",
        queryThrottle: 250,
        fallback,
        optionalPackageFilter,
    });

    const combobox = useCombobox({
        id,
        initialIsOpen,
        defaultHighlightedIndex: 0,
        inputValue,
        onInputValueChange({ inputValue }) {
            return onInputValueChange(inputValue);
        },
        items,
        itemToString(item) {
            return item?.value ?? "";
        },
        stateReducer(state, { type, changes, altKey }) {
            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
                    // Alt+Up arrow should select current
                    if (!altKey) {
                        break;
                    }
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    // If we select a package, we keep it open to autocomplete version
                    if (
                        changes.selectedItem?.type ===
                        AutocompleteSuggestionTypes.Package
                    ) {
                        return {
                            ...changes,
                            isOpen: true,
                        };
                    }
                    break;
                default:
                    break;
            }

            return changes;
        },
        onSelectedItemChange({ selectedItem }) {
            if (
                selectedItem != null &&
                selectedItem.type === AutocompleteSuggestionTypes.Version
            ) {
                versionSelected?.(selectedItem);
            }
        },
    });

    return {
        items,
        ...autocomplete,
        ...combobox,
    };
};
