import { Text } from "@chakra-ui/react";
import {
    useCombobox,
    UseComboboxState,
    UseComboboxStateChangeOptions,
} from "downshift";
import { MutableRefObject, ReactNode, RefObject, useRef } from "react";
import useAsyncState from "^/lib/hooks/useAsyncState";
import useThrottle from "^/lib/hooks/useThrottle";
import ComboboxBox, { ComboboxBoxProps } from "./ComboboxBox";
import ComboboxButton from "./ComboboxButton";
import ComboboxInput, { ComboboxInputProps } from "./ComboboxInput";
import ComboboxLabel from "./ComboboxLabel";
import ComboboxSuggestion from "./ComboboxSuggestion";
import ComboboxSuggestionList from "./ComboboxSuggestionList";
import ComboboxWrapper, { ComboboxWrapperProps } from "./ComboboxWrapper";

export interface ComboboxRef {
    setValue: (input: string) => void;
    focus: () => void;
}

export interface ComboboxProps<I> extends ComboboxWrapperProps {
    id: string;
    comboboxRef?: RefObject<ComboboxRef>;
    /** @default "Find a package" */
    label?: string | null;
    suggestionFinder: (input: string | undefined) => I[] | Promise<I[]>;
    initialSuggestions?: I[];
    throttle?: number;
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
    size?: ComboboxBoxProps["size"];
}

const Combobox = <T,>({
    id,
    comboboxRef,
    label = "Find a package",
    suggestionFinder,
    initialSuggestions = [],
    throttle = 250,
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
    ...props
}: ComboboxProps<T>) => {
    const [items, setItems] = useAsyncState(initialSuggestions);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateSuggestions = useThrottle(
        (inputValue = "") => setItems(suggestionFinder(inputValue)),
        throttle,
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
    } = useCombobox({
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

    if (comboboxRef) {
        (comboboxRef as MutableRefObject<ComboboxRef>).current = {
            setValue: setInputValue,
            focus: () => inputRef.current?.focus(),
        };
    }

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
                            (
                                {
                                    xs: "xs",
                                    sm: "xs",
                                    md: "sm",
                                    lg: "md",
                                } as Record<string, string>
                            )[size] || "sm"
                        }
                        {...getToggleButtonProps()}
                    />
                )}
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
            </ComboboxSuggestionList>
        </ComboboxWrapper>
    );
};

export default Combobox;