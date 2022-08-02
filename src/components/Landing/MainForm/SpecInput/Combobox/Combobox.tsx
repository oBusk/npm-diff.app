import { Spinner, Text } from "@chakra-ui/react";
import {
    useCombobox,
    UseComboboxState,
    UseComboboxStateChangeOptions,
} from "downshift";
import { MutableRefObject, ReactNode, RefObject, useRef } from "react";
import ComboboxBox from "./ComboboxBox";
import ComboboxInput, { ComboboxInputProps } from "./ComboboxInput";
import ComboboxSuggestion from "./ComboboxSuggestion";
import ComboboxSuggestionList from "./ComboboxSuggestionList";
import ComboboxWrapper, { ComboboxWrapperProps } from "./ComboboxWrapper";

export interface ComboboxRef {
    readonly focus: () => void;
    readonly setInputValue: (value: string) => void;
}

export interface ComboboxProps<I> extends ComboboxWrapperProps {
    id: string;
    comboboxRef?: RefObject<ComboboxRef>;
    inputValueChange: (input: string | undefined) => void;
    /** @default "Find a package" */
    label?: string | null;
    items: I[];
    initialIsOpen?: boolean;
    emptyState?: ReactNode;
    /**
     * Convert the item to a string to input into the input field
     *
     * @default (item) => JSON.stringify(item)
     */
    itemToString?: (item: I | null) => string;
    /**
     * How to render the _content_ of the item in the dropdown.
     * Every item is already a `li` element, this prop should define the content of that element.
     *
     * @default ({ item }) => itemToString(item)
     */
    renderItem?: (props: { item?: I; index?: number }) => ReactNode;
    /**
     * A flag to re-open the dropdown when closing it.
     *
     * Use to re-open the dropdown when the user selects something that should be autocompleted again.
     */
    keepOpen?: boolean | ((changes: Partial<UseComboboxState<I>>) => boolean);
    /** Callback to run whenever an item is selected. */
    onItemSelected?: (item: I) => void;
    /** Props that will be forwarded to the `<Input type="text" />` */
    inputProps?: Omit<ComboboxInputProps, "isOpen">;
    /**
     * The chakra-ui "size" to set the input field as.
     * @default "md"
     */
    size?: "lg" | "md" | "sm" | "xs";
    /** If a spinner should show inside the suggestion dropdown or not */
    isLoading?: boolean;
}

const Combobox = <T,>({
    id,
    comboboxRef,
    inputValueChange = () => {},
    label = "Find a package",
    items,
    initialIsOpen = false,
    emptyState = (
        <Text padding="16px" align="center" color="gray.200">
            No suggestions
        </Text>
    ),
    itemToString = (item) =>
        typeof item === "string" ? item : JSON.stringify(item),
    renderItem = ({ item }) => itemToString(item ?? null),
    keepOpen = false,
    onItemSelected,
    inputProps,
    size = "md",
    isLoading = false,
    ...props
}: ComboboxProps<T>) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const shouldKeepOpen =
        typeof keepOpen === "function" ? keepOpen : () => keepOpen;

    const stateReducer: (
        state: UseComboboxState<T>,
        actionAndChanges: UseComboboxStateChangeOptions<T>,
    ) => Partial<UseComboboxState<T>> = (state, { type, changes }) => {
        switch (type) {
            case useCombobox.stateChangeTypes.InputBlur:
                // https://github.com/downshift-js/downshift/issues/1010#issuecomment-626192383
                if (changes.selectedItem != null) {
                    // Extract ignored changes
                    const { selectedItem, inputValue, ...otherChanges } =
                        changes;

                    // Return non-ignored changes
                    return otherChanges;
                }
                break;
            case useCombobox.stateChangeTypes.InputKeyDownEnter:
            case useCombobox.stateChangeTypes.ItemClick:
                return {
                    ...changes,
                    isOpen: shouldKeepOpen(changes),
                };
            default:
                break;
        }

        return changes;
    };

    const {
        getComboboxProps,
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        isOpen,
        openMenu,
        setInputValue,
    } = useCombobox({
        onInputValueChange: ({ inputValue }) => inputValueChange(inputValue),
        defaultHighlightedIndex: 0,
        id,
        items,
        initialIsOpen,
        itemToString,
        stateReducer,
        onSelectedItemChange: onItemSelected
            ? ({ selectedItem }) =>
                  selectedItem != null && onItemSelected(selectedItem)
            : undefined,
    });

    if (comboboxRef) {
        (comboboxRef as MutableRefObject<ComboboxRef>).current = {
            focus() {
                inputRef?.current?.focus();
            },
            setInputValue,
        };
    }

    return (
        <ComboboxWrapper {...props}>
            <ComboboxBox size={size} {...getComboboxProps()}>
                <ComboboxInput
                    isOpen={isOpen}
                    onFocus={openMenu}
                    {...getInputProps({ ref: inputRef })}
                    {...inputProps}
                />
            </ComboboxBox>
            <ComboboxSuggestionList {...getMenuProps()}>
                {isOpen &&
                    (items.length === 0
                        ? emptyState
                        : items.map((item, index) => (
                              <ComboboxSuggestion
                                  key={itemToString(item)}
                                  highlighted={index === highlightedIndex}
                                  {...getItemProps({ item, index })}
                              >
                                  {renderItem({ item, index })}
                              </ComboboxSuggestion>
                          )))}
                {isOpen && isLoading && (
                    <Spinner position="absolute" right={2} bottom={2} />
                )}
            </ComboboxSuggestionList>
        </ComboboxWrapper>
    );
};

export default Combobox;
