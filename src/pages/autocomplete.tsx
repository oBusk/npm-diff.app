import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    Code,
    FormLabel,
    FormLabelProps,
    forwardRef,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputGroupProps,
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
                <ComboboxLabel {...getLabelProps()}>
                    Find a package
                </ComboboxLabel>
                <ComboboxBox {...getComboboxProps()}>
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
                        />
                    </InputRightElement>
                </ComboboxBox>
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
                    {...getMenuProps()}
                >
                    {isOpen &&
                        (inputItems.length === 0 ? (
                            <Text
                                padding="16px"
                                align="center"
                                color="gray.200"
                            >
                                Found no packages
                            </Text>
                        ) : (
                            inputItems.map((item, index) => (
                                <ListItem
                                    key={item.name}
                                    padding="16px"
                                    background={
                                        highlightedIndex === index
                                            ? "gray.100"
                                            : null
                                    }
                                    {...getItemProps({ item, index })}
                                >
                                    <Code>{item.name}</Code>
                                    <Text fontSize="xs">
                                        {item.description}
                                    </Text>
                                </ListItem>
                            ))
                        ))}
                </UnorderedList>
            </BorderBox>
        </Layout>
    );
};

const ComboboxLabel = forwardRef<FormLabelProps, "label">((props, ref) => (
    <FormLabel ref={ref} {...props} />
));

const ComboboxBox = forwardRef<InputGroupProps, "div">((props, ref) => (
    <InputGroup size="lg" {...props} />
));

export default AutocompletePage;
