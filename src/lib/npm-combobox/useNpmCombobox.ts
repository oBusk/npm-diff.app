import { useCombobox } from "downshift";
import { useCallback } from "react";
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
    onInputValueChange: (input: string) => void;
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
        defaultHighlightedIndex: inputValue?.length ? 0 : -1,
        inputValue,
        onInputValueChange({ inputValue }) {
            if (inputValue == null) {
                throw new Error(
                    "[onInputValueChange] inputValue is not defined",
                );
            }
            return onInputValueChange(inputValue);
        },
        items,
        itemToString(item) {
            return item?.value ?? "";
        },
        stateReducer(state, { type, changes, altKey }) {
            switch (type) {
                case useCombobox.stateChangeTypes.InputBlur:
                    // We disable selecting on blur, and select manually on tab instead (see onkeydown).
                    // Downshift tries to see if the blur was because you clicked outside the combobox,
                    // but also triggers when tab/window is deselecting, causing you to select the highlighted
                    // item without intention.
                    // https://github.com/downshift-js/downshift/issues/1010
                    // https://github.dev/downshift-js/downshift/blob/v7.0.1/src/hooks/useCombobox/index.js#L417-L418
                    if (changes.selectedItem != null) {
                        return {
                            ...changes,
                            inputValue: state.inputValue,
                            selectedItem: state.selectedItem,
                        };
                    }
                    break;
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

    const getInputProps = useCallback<typeof combobox.getInputProps>(
        (props, otherOptions) =>
            combobox.getInputProps(
                {
                    ...props,
                    onKeyDown: (event) => {
                        // If consumer passed in a onKeyDown, call it first
                        props?.onKeyDown?.(event);

                        // Add special handler to select a package and keep focus when
                        // pressing tab
                        if (!event.defaultPrevented && event.key === "Tab") {
                            const { highlightedIndex, selectItem } = combobox;
                            const highlightedItem = items[highlightedIndex];

                            if (highlightedItem) {
                                selectItem(highlightedItem);

                                if (
                                    // Highlighted item is package (not version)
                                    highlightedItem.type ===
                                        AutocompleteSuggestionTypes.Package &&
                                    // And we're not tabbing backwards
                                    !event.shiftKey
                                ) {
                                    // Keep the focus on the input
                                    event.preventDefault();
                                }
                            }
                        }
                    },
                },
                otherOptions,
            ),
        [combobox, items],
    );

    return {
        items,
        ...autocomplete,
        ...combobox,
        getInputProps,
    };
};
