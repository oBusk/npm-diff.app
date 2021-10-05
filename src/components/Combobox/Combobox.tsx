import { Text } from "@chakra-ui/react";
import { useCombobox } from "downshift";
import { ReactNode } from "react";
import useAsyncState from "_/lib/utils/useAsyncState";
import useThrottle from "_/lib/utils/useThrottle";
import ComboboxBox from "./ComboboxBox";
import ComboboxButton from "./ComboboxButton";
import ComboboxInput from "./ComboboxInput";
import ComboboxLabel from "./ComboboxLabel";
import ComboboxSuggestion from "./ComboboxSuggestion";
import ComboboxSuggestionList from "./ComboboxSuggestionList";
import ComboboxWrapper, { ComboboxWrapperProps } from "./ComboboxWrapper";

export interface ComboboxProps<I> extends ComboboxWrapperProps {
    id: string;
    suggestionFinder: (input: string | undefined) => I[] | Promise<I[]>;
    initialSuggestions?: I[];
    throttle?: number;
    initialIsOpen?: boolean;
    emptyState?: ReactNode;
    itemToString?: (item: I | null) => string;
    renderItem?: (item: I, index?: number) => ReactNode;
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
    } = useCombobox({
        id,
        items,
        initialIsOpen,
        onInputValueChange: ({ inputValue }) => updateSuggestions(inputValue),
        itemToString,
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
