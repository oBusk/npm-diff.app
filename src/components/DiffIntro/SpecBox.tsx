import {
    Box,
    BoxProps,
    Code,
    forwardRef,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
    useNpmCombobox,
    UseNpmComboboxProps,
} from "^/lib/npm-combobox/useNpmCombobox";
import {
    ComboboxBox,
    ComboboxInput,
    ComboboxSuggestion,
    ComboboxSuggestionList,
    ComboboxWrapper,
} from "../Landing/MainForm/SpecInput/Combobox";
import Suggestion from "../Landing/MainForm/SpecInput/Suggestion";
import ServiceLinks from "./ServiceLinks";

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

type SpecBoxProps = BoxProps &
    Pick<UseNpmComboboxProps, "id"> & {
        packageName: string;
        packageVersion: string;
    };

const SpecBox = forwardRef<SpecBoxProps, "div">(
    ({ packageName, packageVersion, id, ...props }, ref) => {
        const [inputValue, onInputValueChange] = useState(
            `${packageName}@${packageVersion}`,
        );

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
            id,
            fallback: [],
            inputValue,
            onInputValueChange,
        });

        return (
            <Box {...props} ref={ref}>
                <ComboboxWrapper>
                    <ComboboxBox size="xs">
                        <ComboboxInput isOpen={isOpen} {...getInputProps()} />
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
                                            highlighted={
                                                index === highlightedIndex
                                            }
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
                <Box>
                    <ServiceLinks
                        packageName={packageName}
                        packageVersion={packageVersion}
                    />
                </Box>
            </Box>
        );
    },
);

export default SpecBox;
