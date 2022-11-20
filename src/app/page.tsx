import fallback from "^/lib/autocomplete/fallback";
import IndexPageClient from "./page.client";

export interface IndexProps {}

// Ensure static rendering https://beta.nextjs.org/docs/api-reference/segment-config#dynamic
export const dynamic = "force-static";
export const runtime = "experimental-edge";
const IndexPage = async ({}: IndexProps) => {
    const fallbackSuggestions = await fallback();
    return <IndexPageClient fallbackSuggestions={fallbackSuggestions} />;
};

export default IndexPage;
