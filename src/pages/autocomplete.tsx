import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    Box,
    BoxProps,
    Code,
    FormLabel,
    FormLabelProps,
    forwardRef,
    IconButton,
    IconButtonProps,
    Input,
    InputGroup,
    InputGroupProps,
    InputProps,
    InputRightElement,
    ListItem,
    ListItemProps,
    ListProps,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import Layout from "components/Layout";
import BorderBox from "components/theme/BorderBox";
import { useCombobox } from "downshift";
import getPopularPackages from "lib/npms/popularPackages";
import Result from "lib/npms/Result";
import getSuggestions, { Suggestion } from "lib/npms/suggestions";
import useAsyncState from "lib/utils/useAsyncState";
import useThrottle from "lib/utils/useThrottle";
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

    const updateSuggestions = useThrottle(
        (inputValue: string | undefined = "") => {
            setInputItems(
                inputValue.length > 0
                    ? getAutocompleteSuggestions(inputValue)
                    : popularPackages,
            );
        },
        200,
        true,
    );

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
        onInputValueChange: ({ inputValue }) => updateSuggestions(inputValue),
        itemToString: (suggestion) => (suggestion ? suggestion.name : ""),
    });

    return (
        <Layout>
            <ComboboxWrapper as={BorderBox} alignSelf="center">
                <ComboboxLabel {...getLabelProps()}>
                    Find a package
                </ComboboxLabel>
                <ComboboxBox {...getComboboxProps()}>
                    <ComboboxInput {...getInputProps()} />
                    <ComboboxButton
                        aria-label="toggle-menu"
                        {...getToggleButtonProps()}
                    />
                </ComboboxBox>
                <ComboboxSuggestionList {...getMenuProps()}>
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
                                <ComboboxSuggestion
                                    key={item.name}
                                    highlighted={highlightedIndex === index}
                                    {...getItemProps({ item, index })}
                                >
                                    <Code>{item.name}</Code>
                                    <Text fontSize="xs">
                                        {item.description}
                                    </Text>
                                </ComboboxSuggestion>
                            ))
                        ))}
                </ComboboxSuggestionList>
            </ComboboxWrapper>
        </Layout>
    );
};

const ComboboxWrapper = forwardRef<BoxProps, "div">((props, ref) => (
    <Box position="relative" ref={ref} {...props} />
));

const ComboboxLabel = forwardRef<FormLabelProps, "label">((props, ref) => (
    <FormLabel ref={ref} {...props} />
));

const ComboboxBox = forwardRef<InputGroupProps, "div">((props, ref) => (
    <InputGroup size="lg" ref={ref} {...props} />
));

interface ComboboxInputProps extends InputProps {
    isOpen: boolean;
}

const ComboboxInput = forwardRef<ComboboxInputProps, "input">(
    ({ isOpen, ...props }, ref) => (
        <Input
            borderBottomRadius={isOpen ? "0" : undefined}
            ref={ref}
            {...props}
        />
    ),
);

const ComboboxButton = forwardRef<IconButtonProps, "button">((props, ref) => (
    <InputRightElement>
        <IconButton
            type="button"
            icon={<ArrowDownIcon />}
            ref={ref}
            {...props}
            size="sm"
        />
    </InputRightElement>
));

const ComboboxSuggestionList = forwardRef<ListProps, "ul">((props, ref) => (
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
        ref={ref}
        {...props}
    />
));

interface ComboboxSuggestionProps extends ListItemProps {
    highlighted: boolean;
}

const ComboboxSuggestion = forwardRef<ComboboxSuggestionProps, "li">(
    ({ highlighted, ...props }, ref) => (
        <ListItem
            background={highlighted ? "gray.100" : undefined}
            padding="16px"
            ref={ref}
            {...props}
        />
    ),
);

export default AutocompletePage;
