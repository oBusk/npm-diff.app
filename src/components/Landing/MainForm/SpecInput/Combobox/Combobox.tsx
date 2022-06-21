import { Spinner, Text } from "@chakra-ui/react";
import {
    useCombobox,
    UseComboboxState,
    UseComboboxStateChangeOptions,
} from "downshift";
import { ReactNode, RefObject, useCallback, useEffect, useRef } from "react";
import { assignRef } from "use-callback-ref";
import useThrottle from "^/lib/hooks/useThrottle";
import ComboboxBox from "./ComboboxBox";
import ComboboxButton from "./ComboboxButton";
import ComboboxInput, { ComboboxInputProps } from "./ComboboxInput";
import ComboboxLabel from "./ComboboxLabel";
import ComboboxSuggestion from "./ComboboxSuggestion";
import ComboboxSuggestionList from "./ComboboxSuggestionList";
import ComboboxWrapper, { ComboboxWrapperProps } from "./ComboboxWrapper";

export interface ComboboxRef {
    readonly setValue: (input: string) => void;
    readonly value: string;
    readonly focus: () => void;
}

export interface ComboboxProps<I> extends ComboboxWrapperProps {
    id: string;
    comboboxRef?: RefObject<ComboboxRef>;
    /** @default "Find a package" */
    label?: string | null;
    items: I[];
    updateQuery: (input: string) => void;
    /** The number of ms to throttle updates to query */
    queryThrottle?: number;
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
    /** If a small 🔽 toggle should be shown in the comboBox
     * @default false
     */
    showToggleButton?: boolean;
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
    label = "Find a package",
    items,
    updateQuery,
    queryThrottle = 250,
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
    showToggleButton = false,
    inputProps,
    size = "md",
    isLoading = false,
    ...props
}: ComboboxProps<T>) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const updateSuggestions = useThrottle(
        (inputValue = "") => updateQuery(inputValue),
        queryThrottle,
        [updateQuery],
    );

    const shouldKeepOpen =
        typeof keepOpen === "function" ? keepOpen : () => keepOpen;

    const stateReducer: (
        state: UseComboboxState<T>,
        actionAndChanges: UseComboboxStateChangeOptions<T>,
    ) => Partial<UseComboboxState<T>> = (state, { type, changes }) => {
        switch (type) {
            case useCombobox.stateChangeTypes.InputKeyDownEnter:
            case useCombobox.stateChangeTypes.ItemClick:
                return {
                    ...changes,
                    isOpen: shouldKeepOpen(changes),
                };
            default:
                return changes;
        }
    };

    const {
        getComboboxProps,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        highlightedIndex,
        isOpen,
        openMenu,
        setInputValue,
        inputValue,
    } = useCombobox({
        defaultHighlightedIndex: 0,
        id,
        items,
        initialIsOpen,
        onInputValueChange: ({ inputValue }) => updateSuggestions(inputValue),
        itemToString,
        stateReducer,
        onSelectedItemChange: onItemSelected
            ? ({ selectedItem }) =>
                  selectedItem != null && onItemSelected(selectedItem)
            : undefined,
    });

    const focusInput = useCallback(() => inputRef.current?.focus(), [inputRef]);

    useEffect(() => {
        if (comboboxRef) {
            assignRef(comboboxRef, {
                setValue: setInputValue,
                value: inputValue,
                focus: focusInput,
            });
        }
    }, [comboboxRef, setInputValue, inputValue, focusInput]);

    return (
        <ComboboxWrapper {...props}>
            {label && (
                <ComboboxLabel {...getLabelProps()}>{label}</ComboboxLabel>
            )}
            <ComboboxBox size={size} {...getComboboxProps()}>
                <ComboboxInput
                    isOpen={isOpen}
                    onFocus={openMenu}
                    {...inputProps}
                    {...getInputProps({ ref: inputRef })}
                />
                {showToggleButton && (
                    <ComboboxButton
                        aria-label="toggle-menu"
                        size={
                            {
                                xs: "xs",
                                sm: "xs",
                                md: "sm",
                                lg: "md",
                            }[size] || "sm"
                        }
                        {...getToggleButtonProps()}
                    />
                )}
            </ComboboxBox>
            <ComboboxSuggestionList {...getMenuProps()}>
                {isOpen && [
                    items.length === 0
                        ? emptyState
                        : items.map((item, index) => (
                              <ComboboxSuggestion
                                  key={itemToString(item)}
                                  highlighted={index === highlightedIndex}
                                  {...getItemProps({ item, index })}
                              >
                                  {renderItem({ item, index })}
                              </ComboboxSuggestion>
                          )),
                    isLoading && (
                        <Spinner
                            key="spinner"
                            position="absolute"
                            right={2}
                            bottom={2}
                        />
                    ),
                ]}
            </ComboboxSuggestionList>
        </ComboboxWrapper>
    );
};

export default Combobox;
