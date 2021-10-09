import { GetStaticProps, NextPage } from "next";
import Landing from "-/components/Landing";
import AutocompleteSuggestion from "-/lib/autocomplete/AutocompleteSuggestion";
import fallback from "-/lib/autocomplete/fallback";
import { FallbackSuggestionsContext } from "-/lib/contexts/FallbackSuggestions";

export interface IndexProps {
    fallbackSuggestions: AutocompleteSuggestion[];
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
    return {
        props: {
            fallbackSuggestions: await fallback(),
        },
        revalidate: 60 * 60,
    };
};

const IndexPage: NextPage<IndexProps> = ({ fallbackSuggestions }) => {
    return (
        <FallbackSuggestionsContext.Provider value={fallbackSuggestions}>
            <Landing />
        </FallbackSuggestionsContext.Provider>
    );
};

export default IndexPage;
