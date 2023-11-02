import { Spinner, Text } from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { type AutocompleteSuggestion } from "^/lib/autocomplete";
import {
    useNpmCombobox,
    type UseNpmComboboxProps,
} from "^/lib/npm-combobox/useNpmCombobox";
import {
    ComboboxBox,
    type ComboboxBoxProps,
    ComboboxInput,
    type ComboboxInputProps,
    ComboboxSuggestion,
    ComboboxSuggestionList,
    ComboboxWrapper,
    type ComboboxWrapperProps,
} from "./Combobox";
import Suggestion from "./Suggestion";

export interface SpecInputRef {
    focus: () => void;
}

export interface SpecInputProps extends Omit<UseNpmComboboxProps, "fallback"> {
    wrapperProps?: ComboboxWrapperProps;
    inputProps?: Omit<ComboboxInputProps, "isOpen">;
    size: ComboboxBoxProps["size"];
    fallbackSuggestions?: AutocompleteSuggestion[];
}

const SuggestionListText = ({
    children,
    error = false,
}: {
    children: string;
    error?: boolean;
}) => (
    <Text padding="2em" align="center" color={error ? "red.500" : "gray.500"}>
        {children}
    </Text>
);

const SpecInput = forwardRef<SpecInputRef, SpecInputProps>(
    (
        {
            wrapperProps = {},
            inputProps = {},
            size,
            fallbackSuggestions = [],

            ...useNpmComboboxProps
        },
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);

        const {
            error,
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            isOpen,
            items,
            loading,
            openMenu,
        } = useNpmCombobox({
            ...useNpmComboboxProps,
            fallback: fallbackSuggestions,
        });

        useImperativeHandle(
            ref,
            (): SpecInputRef => ({
                focus: () => {
                    inputRef.current?.focus();
                    openMenu();
                },
            }),
        );

        return (
            <ComboboxWrapper width="100%" maxWidth="20em" {...wrapperProps}>
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
                    {isOpen ? (
                        <>
                            {error ? (
                                <SuggestionListText error={true}>
                                    Something went wrong.
                                </SuggestionListText>
                            ) : items.length === 0 ? (
                                <SuggestionListText>
                                    No suggestions
                                </SuggestionListText>
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
                            )}
                            {loading ? (
                                <Spinner
                                    position="absolute"
                                    right={2}
                                    bottom={2}
                                />
                            ) : null}
                        </>
                    ) : null}
                </ComboboxSuggestionList>
            </ComboboxWrapper>
        );
    },
);
SpecInput.displayName = "SpecInput";

export default SpecInput;
