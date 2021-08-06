import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    Button,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import Layout from "components/Layout";
import BorderBox from "components/theme/BorderBox";
import { useCombobox } from "downshift";
import { NextPage } from "next";
import { useState } from "react";

export interface AutocompletePageProps {}

const items = ["apple", "banana", "orange", "grapefruit", "lemon"];

const AutocompletePage: NextPage<AutocompletePageProps> = (props, context) => {
    const [inputItems, setInputItems] = useState(items);
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
        items: inputItems,
        onInputValueChange: ({ inputValue = "" }) => {
            setInputItems(
                items.filter((item) =>
                    item.toLowerCase().startsWith(inputValue.toLowerCase()),
                ),
            );
        },
    });

    return (
        <Layout alignItems="center">
            <BorderBox>
                <FormLabel {...getLabelProps()}>Choose an element:</FormLabel>
                <InputGroup size="md" style={{}} {...getComboboxProps()}>
                    <Input {...getInputProps()} />
                    <InputRightElement>
                        <IconButton
                            type="button"
                            size="sm"
                            icon={<ArrowDownIcon />}
                            {...getToggleButtonProps()}
                            aria-label="toggle-menu"
                        >
                            &#8595;
                        </IconButton>
                    </InputRightElement>
                </InputGroup>
                <ul {...getMenuProps()} style={{}}>
                    {isOpen &&
                        inputItems.map((item, index) => (
                            <li
                                style={
                                    highlightedIndex === index
                                        ? { backgroundColor: "#bde4ff" }
                                        : {}
                                }
                                key={`${item}${index}`}
                                {...getItemProps({ item, index })}
                            >
                                {item}
                            </li>
                        ))}
                </ul>
            </BorderBox>
        </Layout>
    );
};

export default AutocompletePage;
