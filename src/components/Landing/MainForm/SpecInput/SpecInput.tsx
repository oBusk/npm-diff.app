import { Spinner, Text } from "@chakra-ui/react";
import { useCombobox } from "downshift";
import { FunctionComponent, RefObject, useContext } from "react";
import {
    AutocompleteSuggestion,
    AutocompleteSuggestionTypes,
} from "^/lib/autocomplete";
import useAutocomplete from "^/lib/autocomplete/useAutocomplete";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import {
    ComboboxBox,
    ComboboxBoxProps,
    ComboboxInput,
    ComboboxInputProps,
    ComboboxSuggestion,
    ComboboxSuggestionList,
    ComboboxWrapper,
    ComboboxWrapperProps,
} from "./Combobox";
import Suggestion from "./Suggestion";

export interface SpecInputProps extends ComboboxWrapperProps {
    id: string;
    initialIsOpen?: boolean;
    inputProps?: Omit<ComboboxInputProps, "isOpen">;
    inputRef?: RefObject<HTMLInputElement>;
    inputValue: string | undefined;
    onInputValueChange: (input: string | undefined) => void;
    /**
     * If specified, `SpecInput` will try to find versions that matches this spec.
     *
     * If no matches are found, this filter is ignored.
     */
    optionalPackageFilter?: string;
    size: ComboboxBoxProps["size"];
    versionSelected?: (item: AutocompleteSuggestion) => void;
}

const SpecInput: FunctionComponent<SpecInputProps> = ({
    id,
    initialIsOpen,
    inputProps = {},
    inputRef,
    inputValue,
    onInputValueChange,
    optionalPackageFilter,
    size,
    versionSelected,
    ...props
}) => {
    const fallback = useContext(FallbackSuggestionsContext);

    const { items, loading } = useAutocomplete({
        query: inputValue ?? "",
        queryThrottle: 250,
        fallback,
        optionalPackageFilter,
    });

    const {
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        isOpen,
    } = useCombobox({
        inputValue,
        onInputValueChange({ inputValue }) {
            return onInputValueChange(inputValue);
        },
        defaultHighlightedIndex: 0,
        id,
        items,
        initialIsOpen,
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

    return (
        <ComboboxWrapper width="100%" maxWidth="20em" {...props}>
            <ComboboxBox size={size}>
                <ComboboxInput
                    isOpen={isOpen}
                    {...getInputProps({
                        ref: inputRef,
                    })}
                    {...inputProps}
                />
            </ComboboxBox>
            <ComboboxSuggestionList {...getMenuProps()}>
                {isOpen &&
                    (items.length === 0 ? (
                        <Text padding="16px" align="center" color="gray.200">
                            No suggestions
                        </Text>
                    ) : (
                        items.map((item, index) => (
                            <ComboboxSuggestion
                                key={item.value}
                                highlighted={index === highlightedIndex}
                                {...getItemProps({ item, index })}
                            >
                                <Suggestion item={item} />
                            </ComboboxSuggestion>
                        ))
                    ))}
                {isOpen && loading && (
                    <Spinner position="absolute" right={2} bottom={2} />
                )}
            </ComboboxSuggestionList>
        </ComboboxWrapper>
    );
};

export default SpecInput;
