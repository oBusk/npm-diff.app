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

const SuggestionTitle = styled(Code, {
    baseStyle: {
        // `npms` wraps the matching part of the package name with `<em>`.
        // The Italic looks a bit too discreet, so let's remove italic
        // and add underline instead.
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
            itemToString={(suggestion) => suggestion?.value || ""}
            renderItem={({ title, body, titleWithHighlight }) => (
                <>
                    {titleWithHighlight ? (
                        <SuggestionTitle
                            dangerouslySetInnerHTML={{
                                __html: titleWithHighlight,
                            }}
                        ></SuggestionTitle>
                    ) : (
                        <SuggestionTitle>{title}</SuggestionTitle>
                    )}

                    {body && <Text>{body}</Text>}
                </>
            )}
            reopenOnClose={({ inputValue }) =>
                inputValue?.endsWith("@") || false
            }
        />
    </Layout>
);

export default AutocompletePage;
