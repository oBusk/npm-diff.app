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
import { GetStaticProps, NextPage } from "next";
import { useState } from "react";

export interface NpmsPackageLinks {
    npm: string;
    homepage: string;
    repository: string;
    bugs: string;
}

export interface NpmsPackageAuthor {
    name: string;
}

export interface NpmsPackageMaintainer {
    username: string;
    email: string;
}

export interface NpmsPackage {
    name: string;
    scope: string;
    version: string;
    description: string;
    keywords: string[];
    date: string;
    links: NpmsPackageLinks;
    author: NpmsPackageAuthor;
    publisher: NpmsPackageMaintainer;
    maintainers: NpmsPackageMaintainer[];
}

export interface NpmsFlags {
    deprecated?: true;
    unstable?: true;
    insecure?: true;
}

export interface NpmsSuggestionScoreDetail {
    quality: number;
    popularity: number;
    maintenance: number;
}

export interface NpmsSuggestionScore {
    final: number;
    detail: NpmsSuggestionScoreDetail;
}

// https://api-docs.npms.io/
export interface NpmsSuggestion extends NpmsSearchResult {
    /** A string containing highlighted matched text */
    highlight?: string;
}

export interface NpmsSearchResult {
    /** The package data which contains the name, version and other useful information */
    package: NpmsPackage;
    /** The package flags (deprecated, unstable, insecure) */
    flags?: NpmsFlags;
    /** The package score */
    score: NpmsSuggestionScore;
    /** The computed search score (from Elasticsearch) */
    searchScore: number;
}

export type NpmsSuggestions = NpmsSuggestion[];

export interface NpmsSearchResults {
    total: number;
    results: NpmsSearchResult[];
}

async function getSuggestions(query: string): Promise<string[]> {
    const suggestionSort = (
        suggestionA: NpmsSuggestion,
        suggestionB: NpmsSuggestion,
    ) => {
        // Rank closely matching packages followed
        // by most popular ones
        if (
            Math.abs(
                Math.log(suggestionB.searchScore) -
                    Math.log(suggestionA.searchScore),
            ) > 1
        ) {
            return suggestionB.searchScore - suggestionA.searchScore;
        } else {
            return (
                suggestionB.score.detail.popularity -
                suggestionA.score.detail.popularity
            );
        }
    };

    const response = await fetch(
        `https://api.npms.io/v2/search/suggestions?q=${query}`,
    );
    const json: NpmsSuggestions = await response.json();
    const sorted = json.sort(suggestionSort);
    const packageNames = sorted.map((suggestion) => suggestion.package.name);

    return packageNames;
}

async function getPopularPackages(): Promise<NpmsSearchResults> {
    const response = await fetch(
        `https://api.npms.io/v2/search?q=not:deprecated`,
    );
    const json = await response.json();
    return json;
}

export interface AutocompletePageProps {
    popularPackages: string[];
}

export const getStaticProps: GetStaticProps<AutocompletePageProps> =
    async () => {
        const { results } = await getPopularPackages();
        const popularPackages = results.map((p) => p.package.name);

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
                    ? await getSuggestions(inputValue)
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
