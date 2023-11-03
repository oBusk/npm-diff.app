"use client";

import { Loader2 } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { AutocompleteSuggestion } from "^/lib/autocomplete";
import { cx } from "^/lib/cva";
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

export interface SpecInputRef {
    focus: () => void;
}

export interface SpecInputProps extends Omit<UseNpmComboboxProps, "fallback"> {
    wrapperProps?: ComboboxWrapperProps;
    inputProps?: Omit<ComboboxInputProps, "isOpen">;
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
        className={cx(
            "p-8 text-center",
            error ? "text-red-500" : "text-gray-500",
        )}
    >
        {children}
    </div>
);

const SpecInput = forwardRef<SpecInputRef, SpecInputProps>(
    (
        {
            wrapperProps: { className: wrapperClassName, ...wrapperProps } = {},
            inputProps = {},
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
            <ComboboxWrapper
                className={cx("w-full max-w-xs", wrapperClassName)}
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
                                <Loader2 className="absolute bottom-1 right-1 animate-spin" />
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
