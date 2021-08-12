import { BoxProps, Text } from "@chakra-ui/react";
import { useCombobox } from "downshift";
import useAsyncState from "lib/utils/useAsyncState";
import useThrottle from "lib/utils/useThrottle";
import { ReactNode } from "react";
import ComboboxBox from "./ComboboxBox";
import ComboboxButton from "./ComboboxButton";
import ComboboxInput from "./ComboboxInput";
import ComboboxLabel from "./ComboboxLabel";
import ComboboxSuggestion from "./ComboboxSuggestion";
import ComboboxSuggestionList from "./ComboboxSuggestionList";
import ComboboxWrapper from "./ComboboxWrapper";

export interface ComboboxProps<I> extends BoxProps {
    id: string;
    suggestionFinder: (input: string | undefined) => I[] | Promise<I[]>;
    initialSuggestions?: I[];
    throttle?: number;
    initialIsOpen?: boolean;
    emptyState?: ReactNode;
    itemToString?: (item: I | null) => string;
    renderItem?: (item: I, index?: number) => ReactNode;
}

export const defaultEmptyState = (
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
    emptyState = (
        <Text padding="16px" align="center" color="gray.200">
            No suggestions
        </Text>
    ),
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
