import { Loader2 } from "lucide-react";
import { FunctionComponent, RefObject } from "react";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
import cn from "^/lib/cn";
import {
    useNpmCombobox,
    UseNpmComboboxProps,
} from "^/lib/npm-combobox/useNpmCombobox";
import {
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
    fallbackSuggestions?: AutocompleteSuggestion[];
}

const SuggestionListText = ({
    children,
    error = false,
}: {
    children: string;
    error?: boolean;
}) => (
    <div
        className={cn(
            "p-8 text-center",
            error ? "text-red-500" : "text-gray-500",
        )}
    >
        {children}
    </div>
);

const SpecInput: FunctionComponent<SpecInputProps> = ({
    wrapperProps: { className: wrapperClassName, ...wrapperProps } = {},
    inputProps = {},
    inputRef,
    fallbackSuggestions = [],

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
        fallback: fallbackSuggestions,
    });

    return (
        <ComboboxWrapper
            className={cn("w-full max-w-xs", wrapperClassName)}
            {...wrapperProps}
        >
            <ComboboxInput
                isOpen={isOpen}
                {...getInputProps({
                    ref: inputRef,
                })}
                {...inputProps}
            />
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
                            <Loader2
                                className={cn(
                                    "absolute bottom-1 right-1 animate-spin",
                                )}
                            />
                        ) : null}
                    </>
                ) : null}
            </ComboboxSuggestionList>
        </ComboboxWrapper>
    );
};

export default SpecInput;
