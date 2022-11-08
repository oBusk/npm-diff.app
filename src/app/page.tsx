import Landing from "^/components/Landing";
import fallback from "^/lib/autocomplete/fallback";

export interface IndexProps {}

const IndexPage = async ({}: IndexProps) => {
    const fallbackSuggestions = await fallback();
    return <Landing fallbackSuggestions={fallbackSuggestions} />;
};

export default IndexPage;
