import { Text } from "@chakra-ui/react";
import { useCombobox, UseComboboxStateChange } from "downshift";
import { ReactNode } from "react";
import ComboboxBox from "./ComboboxBox";
import ComboboxButton from "./ComboboxButton";
import ComboboxInput from "./ComboboxInput";
import ComboboxLabel from "./ComboboxLabel";
import ComboboxSuggestion from "./ComboboxSuggestion";
import ComboboxSuggestionList from "./ComboboxSuggestionList";
import ComboboxWrapper, { ComboboxWrapperProps } from "./ComboboxWrapper";
import useAsyncState from "-/lib/hooks/useAsyncState";
import useThrottle from "-/lib/hooks/useThrottle";

export interface ComboboxProps<I> extends ComboboxWrapperProps {
    id: string;
    suggestionFinder: (input: string | undefined) => I[] | Promise<I[]>;
    initialSuggestions?: I[];
    throttle?: number;
    initialIsOpen?: boolean;
    emptyState?: ReactNode;
    /** Convert the item to a string to input into the input field */
    itemToString?: (item: I | null) => string;
    /** How to render the item in the dropdown */
    renderItem?: (item: I, index?: number) => ReactNode;
    /**
     * NOTE: This is a bit of a hack.
     *
     * A flag to re-open the dropdown when closing it.
     *
     * Use to re-open the dropdown when the user selects something that should be autocompleted again.
     */
    reopenOnClose?: boolean | ((changes: UseComboboxStateChange<I>) => boolean);
}

const defaultEmptyState = (
    <Text padding="16px" align="center" color="gray.200">
        No suggestions
    </Text>
);

const Combobox = <T,>({
    id,
    suggestionFinder,
    initialSuggestions = [],
    throttle = 250,
    initialIsOpen = true,
    emptyState = defaultEmptyState,
    itemToString = (item) =>
        typeof item === "string" ? item : JSON.stringify(item),
    renderItem = (item, _index) => itemToString(item),
    reopenOnClose = false,
    ...props
}: ComboboxProps<T>) => {
    const [items, setItems] = useAsyncState(initialSuggestions);

    const updateSuggestions = useThrottle(
        (inputValue = "") => setItems(suggestionFinder(inputValue)),
        throttle,
    );

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
    } = useCombobox({
        id,
        items,
        initialIsOpen,
        onInputValueChange: ({ inputValue }) => updateSuggestions(inputValue),
        itemToString,
        onIsOpenChange: (changes) => {
            if (!changes.isOpen) {
                if (
                    typeof reopenOnClose === "function"
                        ? reopenOnClose(changes)
                        : reopenOnClose
                ) {
                    openMenu();
                }
            }
        },
    });

    return (
        <ComboboxWrapper {...props}>
            <ComboboxLabel {...getLabelProps()}>Find a package</ComboboxLabel>
            <ComboboxBox {...getComboboxProps()}>
                <ComboboxInput isOpen={isOpen} {...getInputProps()} />
                <ComboboxButton
                    aria-label="toggle-menu"
                    {...getToggleButtonProps()}
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
                                  {renderItem(item, index)}
                              </ComboboxSuggestion>
                          )))}
            </ComboboxSuggestionList>
        </ComboboxWrapper>
    );
};

export default Combobox;
