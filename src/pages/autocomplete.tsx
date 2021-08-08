import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    Code,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    ListItem,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import Layout from "components/Layout";
import BorderBox from "components/theme/BorderBox";
import { useCombobox } from "downshift";
import getPopularPackages from "lib/npms/popularPackages";
import Result from "lib/npms/Result";
import getSuggestions, { Suggestion } from "lib/npms/suggestions";
import useAsyncState from "lib/useAsyncState";
import { GetStaticProps, NextPage } from "next";

interface AutocompleteSuggestion {
    name: string;
    description: string;
}

export interface AutocompletePageProps {
    popularPackages: AutocompleteSuggestion[];
}

const AUTOCOMPLETE_SIZE = 6;

const toAutocompleteSuggestion = ({
    package: { name, description },
}: Result | Suggestion) => ({
    name,
    description,
});

const getAutocompleteSuggestions = async (query: string) => {
    const results = await getSuggestions(query, AUTOCOMPLETE_SIZE);

    return results.map(toAutocompleteSuggestion);
};

export const getStaticProps: GetStaticProps<AutocompletePageProps> =
    async () => {
        const { results } = await getPopularPackages(AUTOCOMPLETE_SIZE);
        const popularPackages = results.map(toAutocompleteSuggestion);

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
    const [inputItems, setInputItems] = useAsyncState(popularPackages);
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
        id: "autocomplete",
        items: inputItems,
        initialIsOpen: true,
        onInputValueChange: async ({ inputValue = "" }) => {
            setInputItems(
                inputValue.length > 0
                    ? getAutocompleteSuggestions(inputValue)
                    : popularPackages,
            );
        },
        itemToString: (suggestion) => (suggestion ? suggestion.name : ""),
    });

    return (
        <Layout>
            <BorderBox alignSelf="center" position="relative">
                <FormLabel {...getLabelProps()}>Choose an element:</FormLabel>
                <InputGroup size="lg" style={{}} {...getComboboxProps()}>
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
                                key={`${item.name}${index}`}
                                padding="16px"
                                background={
                                    highlightedIndex === index
                                        ? "gray.100"
                                        : null
                                }
                                {...getItemProps({ item, index })}
                            >
                                <Code>{item.name}</Code>
                                <Text fontSize="xs">{item.description}</Text>
                            </ListItem>
                        ))}
                </UnorderedList>
            </BorderBox>
        </Layout>
    );
};

export default AutocompletePage;
