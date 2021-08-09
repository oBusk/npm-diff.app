import Combobox from "components/Combobox";
import Layout from "components/Layout";
import BorderBox from "components/theme/BorderBox";
import getPopularPackages from "lib/npms/popularPackages";
import Result from "lib/npms/Result";
import getSuggestions, { Suggestion } from "lib/npms/suggestions";
import { GetStaticProps, NextPage } from "next";
import { useCallback } from "react";
import { Code, Text } from "@chakra-ui/react";

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
    const suggestionFinder = useCallback(
        (inputValue: string | undefined = "") =>
            inputValue.length > 0
                ? getAutocompleteSuggestions(inputValue)
                : popularPackages,
        [popularPackages],
    );

    const itemToString = useCallback(
        (suggestion) => (suggestion ? suggestion.name : ""),
        [],
    );

    return (
        <Layout>
            <Combobox
                alignSelf="center"
                as={BorderBox}
                id="autocomplete"
                suggestionFinder={suggestionFinder}
                initialSuggestions={popularPackages}
                itemToString={itemToString}
                renderItem={(item) => (
                    <>
                        <Code>{item.name}</Code>
                        <Text>{item.description}</Text>
                    </>
                )}
            />
        </Layout>
    );
};

export default AutocompletePage;
