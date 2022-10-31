import { Spinner, Text } from "@chakra-ui/react";
import { FunctionComponent, RefObject, useContext } from "react";
import { FallbackSuggestionsContext } from "^/lib/contexts/FallbackSuggestions";
import {
    useNpmCombobox,
    UseNpmComboboxProps,
} from "^/lib/npm-combobox/useNpmCombobox";
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

export interface SpecInputProps extends Omit<UseNpmComboboxProps, "fallback"> {
    wrapperProps?: ComboboxWrapperProps;
    inputProps?: Omit<ComboboxInputProps, "isOpen">;
    inputRef?: RefObject<HTMLInputElement>;
    size: ComboboxBoxProps["size"];
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

const SpecInput: FunctionComponent<SpecInputProps> = ({
    wrapperProps = {},
    inputProps = {},
    inputRef,
    size,

    ...useNpmComboboxProps
}) => {
    const {
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        isOpen,
        items,
        loading,
        error,
    } = useNpmCombobox({
        ...useNpmComboboxProps,
        fallback: useContext(FallbackSuggestionsContext),
    });

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
                            <Spinner position="absolute" right={2} bottom={2} />
                        ) : null}
                    </>
                ) : null}
            </ComboboxSuggestionList>
        </ComboboxWrapper>
    );
};

export default SpecInput;
