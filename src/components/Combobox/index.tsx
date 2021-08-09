import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    BoxProps,
    FormLabelProps,
    forwardRef,
    IconButtonProps,
    InputGroupProps,
    InputProps,
    ListItemProps,
    ListProps,
    Text,
    Code,
    Box,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    UnorderedList,
    ListItem,
} from "@chakra-ui/react";
import { useCombobox } from "downshift";
import useAsyncState from "lib/utils/useAsyncState";
import useThrottle from "lib/utils/useThrottle";
import React, { LegacyRef, useCallback } from "react";

export interface ComboboxProps<I> extends BoxProps {
    id: string;
    suggestionFinder: (input: string | undefined) => I[] | Promise<I[]>;
    initialSuggestions?: I[];
    throttle?: number;
    initialIsOpen?: boolean;
    emptyState?: React.ReactNode;
    itemToString?: (item: I | null) => string;
    renderItem?: (item: I, index?: number) => React.ReactNode;
}

export const defaultEmptyState = (
    <Text padding="16px" align="center" color="gray.200">
        No suggestions
    </Text>
);

const Combobox = forwardRef(
    <T,>(
        {
            id,
            suggestionFinder,
            initialSuggestions = [],
            throttle = 200,
            initialIsOpen = true,
            emptyState = defaultEmptyState,
            itemToString = (item) =>
                typeof item === "string" ? item : JSON.stringify(item),
            renderItem = (item, _index) => itemToString(item),
            ...props
        }: ComboboxProps<T>,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const [inputItems, setInputItems] = useAsyncState(initialSuggestions);

        const updateSuggestions = useThrottle(
            (inputValue: string | undefined = "") => {
                setInputItems(suggestionFinder(inputValue));
            },
            throttle,
            true,
        );

        const onInputValueChange = useCallback(
            ({ inputValue }) => updateSuggestions(inputValue),
            [updateSuggestions],
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
            items: inputItems,
            initialIsOpen,
            onInputValueChange,
            itemToString,
        });

        return (
            <ComboboxWrapper ref={ref} {...props}>
                <ComboboxLabel {...getLabelProps()}>
                    Find a package
                </ComboboxLabel>
                <ComboboxBox {...getComboboxProps()}>
                    <ComboboxInput {...getInputProps()} />
                    <ComboboxButton
                        aria-label="toggle-menu"
                        {...getToggleButtonProps()}
                    />
                </ComboboxBox>
                <ComboboxSuggestionList {...getMenuProps()}>
                    {isOpen &&
                        (inputItems.length === 0
                            ? emptyState
                            : inputItems.map((item, index) => (
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
    },
);

export default Combobox;

const ComboboxWrapper = forwardRef<BoxProps, "div">((props, ref) => (
    <Box position="relative" ref={ref} {...props} />
));

const ComboboxLabel = forwardRef<FormLabelProps, "label">((props, ref) => (
    <FormLabel ref={ref} {...props} />
));

const ComboboxBox = forwardRef<InputGroupProps, "div">((props, ref) => (
    <InputGroup size="lg" ref={ref} {...props} />
));

interface ComboboxInputProps extends InputProps {
    isOpen: boolean;
}

const ComboboxInput = forwardRef<ComboboxInputProps, "input">(
    ({ isOpen, ...props }, ref) => (
        <Input
            borderBottomRadius={isOpen ? "0" : undefined}
            ref={ref}
            {...props}
        />
    ),
);

const ComboboxButton = forwardRef<IconButtonProps, "button">((props, ref) => (
    <InputRightElement>
        <IconButton
            type="button"
            icon={<ArrowDownIcon />}
            ref={ref}
            {...props}
            size="sm"
        />
    </InputRightElement>
));

const ComboboxSuggestionList = forwardRef<ListProps, "ul">((props, ref) => (
    <UnorderedList
        background="white"
        borderWidth={1}
        borderTopWidth={0}
        borderBottomRadius="lg"
        position="absolute"
        styleType="none"
        marginX="16px"
        left={0}
        right={0}
        ref={ref}
        {...props}
    />
));

interface ComboboxSuggestionProps extends ListItemProps {
    highlighted: boolean;
}

const ComboboxSuggestion = forwardRef<ComboboxSuggestionProps, "li">(
    ({ highlighted, ...props }, ref) => (
        <ListItem
            background={highlighted ? "gray.100" : undefined}
            padding="16px"
            ref={ref}
            {...props}
        />
    ),
);
