import { Code, Text } from "@chakra-ui/react";
import Combobox from "components/Combobox";
import Layout from "components/Layout";
import BorderBox from "components/theme/BorderBox";
import getPopularPackages from "lib/npms/popularPackages";
import Result from "lib/npms/Result";
import getSuggestions, { Suggestion } from "lib/npms/suggestions";
import { GetStaticProps, NextPage } from "next";
import type { ApiVersionsResponse } from "./api/versions";

interface AutocompleteSuggestion {
    name: string;
    description?: string;
}

export interface AutocompletePageProps {
    popularPackages: AutocompleteSuggestion[];
}

const AUTOCOMPLETE_SIZE = 6;

const toAutocompleteSuggestion = ({
    package: { name, description },
}: Result | Suggestion): AutocompleteSuggestion => ({
    name,
    description,
});

const getAutocompleteSuggestions = async (query: string) => {
    const results = await getSuggestions(query, AUTOCOMPLETE_SIZE);

    return results.map(toAutocompleteSuggestion);
};

const hasAt = /[^@]@\S*$/;

const search = async (query: string): Promise<AutocompleteSuggestion[]> => {
    if (hasAt.test(query)) {
        const response = await fetch(`/api/versions?spec=${query}`);
        const versions: ApiVersionsResponse = await response.json();

        return versions.map(({ name, version }) => ({
            name: `${name}@${version}`,
        }));
    } else {
        return getAutocompleteSuggestions(query);
    }
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
}) => (
    <Layout>
        <Combobox
            alignSelf="center"
            as={BorderBox}
            id="autocomplete"
            suggestionFinder={(q) => (q === "" ? popularPackages : search(q))}
            initialSuggestions={popularPackages}
            itemToString={(suggestion) => suggestion?.name || ""}
            renderItem={(item) => (
                <>
                    <Code>{item.name}</Code>
                    {item.description && <Text>{item.description}</Text>}
                </>
            )}
        />
    </Layout>
);

export default AutocompletePage;
