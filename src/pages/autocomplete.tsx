import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    ListItem,
    UnorderedList,
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
            <BorderBox position="relative">
                <FormLabel {...getLabelProps()}>Choose an element:</FormLabel>
                <InputGroup size="md" style={{}} {...getComboboxProps()}>
                    <Input
                        borderBottomRadius={isOpen ? "0" : undefined}
                        {...getInputProps()}
                    />
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
                <UnorderedList
                    background="white"
                    borderWidth={1}
                    borderTopWidth={0}
                    borderBottomRadius="lg"
                    position="absolute"
                    styleType="none"
                    stylePosition="inside"
                    marginX="16px"
                    left={0}
                    right={0}
                    _empty={{
                        padding: 0,
                        visibility: "hidden",
                    }}
                    {...getMenuProps()}
                    style={{}}
                >
                    {isOpen &&
                        inputItems.map((item, index) => (
                            <ListItem
                                key={`${item}${index}`}
                                padding="16px"
                                background={
                                    highlightedIndex === index
                                        ? "gray.100"
                                        : null
                                }
                                {...getItemProps({ item, index })}
                            >
                                {item}
                            </ListItem>
                        ))}
                </UnorderedList>
            </BorderBox>
        </Layout>
    );
};

export default AutocompletePage;
