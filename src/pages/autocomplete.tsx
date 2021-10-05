import { Code, Text } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Combobox from "_/components/Combobox";
import Layout from "_/components/Layout";
import BorderBox from "_/components/theme/BorderBox";
import getAutocompleter from "_/lib/autocomplete";
import fallback, { AutocompleteFallback } from "_/lib/autocomplete/fallback";

export interface AutocompletePageProps {
    fallback: AutocompleteFallback;
}

export const getStaticProps: GetStaticProps<AutocompletePageProps> =
    async () => {
        return {
            props: {
                fallback: await fallback(),
            },
            revalidate: 60 * 60,
        };
    };

const AutocompletePage: NextPage<AutocompletePageProps> = ({ fallback }) => (
    <Layout>
        <Combobox
            alignSelf="center"
            as={BorderBox}
            id="autocomplete"
            initialSuggestions={fallback}
            suggestionFinder={getAutocompleter(fallback)}
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
