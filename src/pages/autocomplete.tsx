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
import getPopularPackages from "lib/npms/popularPackages";
import suggestions from "lib/npms/suggestions";
import { GetStaticProps, NextPage } from "next";
import { useState } from "react";

export interface AutocompletePageProps {
    popularPackages: string[];
}

export const getStaticProps: GetStaticProps<AutocompletePageProps> =
    async () => {
        const asd = await getPopularPackages();
        const popularPackages = asd.results.map((p) => p.package.name);

        return {
            props: {
                popularPackages,
            },
            revalidate: 60 * 60,
        };
    };

const AutocompletePage: NextPage<AutocompletePageProps> = ({
    popularPackages,
}) => {
    const [inputItems, setInputItems] = useState(popularPackages);
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
        initialIsOpen: true,
        onInputValueChange: async ({ inputValue = "" }) => {
            const packages =
                inputValue.length > 0
                    ? await suggestions(inputValue)
                    : popularPackages;
            setInputItems(packages);
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
