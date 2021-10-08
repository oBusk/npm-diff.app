import { Code, styled, Text } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Combobox from "-/components/Combobox";
import Layout from "-/components/Layout";
import BorderBox from "-/components/theme/BorderBox";
import getAutocompleter from "-/lib/autocomplete";
import fallback, { AutocompleteFallback } from "-/lib/autocomplete/fallback";

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

const PackageName = styled(Code, {
    baseStyle: {
        em: {
            fontStyle: "normal",
            textDecoration: "underline",
        },
    },
});

const AutocompletePage: NextPage<AutocompletePageProps> = ({ fallback }) => (
    <Layout>
        <Combobox
            alignSelf="center"
            as={BorderBox}
            id="autocomplete"
            initialSuggestions={fallback}
            suggestionFinder={getAutocompleter(fallback)}
            itemToString={(suggestion) => suggestion?.name || ""}
            renderItem={({ name, description, highlight }) => (
                <>
                    {highlight ? (
                        <PackageName
                            dangerouslySetInnerHTML={{ __html: highlight }}
                        ></PackageName>
                    ) : (
                        <PackageName>{name}</PackageName>
                    )}

                    {description && <Text>{description}</Text>}
                </>
            )}
        />
    </Layout>
);

export default AutocompletePage;
