import fallback from "^/lib/autocomplete/fallback";
import IndexPageClient from "./page.client";

export interface IndexProps {}

export const runtime = "experimental-edge";
const IndexPage = async ({}: IndexProps) => {
    const fallbackSuggestions = await fallback();
    return <IndexPageClient fallbackSuggestions={fallbackSuggestions} />;
};

export default IndexPage;
