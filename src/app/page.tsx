import fallback from "^/lib/autocomplete/fallback";
import Landing from "./Landing";

export interface IndexProps {}

const IndexPage = async ({}: IndexProps) => {
    const fallbackSuggestions = await fallback();
    return <Landing fallbackSuggestions={fallbackSuggestions} />;
};

export default IndexPage;
