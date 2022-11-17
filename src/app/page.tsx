import fallback from "^/lib/autocomplete/fallback";
import IndexPageClient from "./page.client";

export interface IndexProps {}

const IndexPage = async ({}: IndexProps) => {
    const fallbackSuggestions = await fallback();
    return <IndexPageClient fallbackSuggestions={fallbackSuggestions} />;
};

export default IndexPage;
