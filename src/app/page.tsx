import fallback from "^/lib/autocomplete/fallback";
import Intro from "./_page/Intro";
import IndexPageClient from "./page.client";

export interface IndexProps {}

const IndexPage = async ({}: IndexProps) => {
    const fallbackSuggestions = await fallback();

    return (
        <>
            <Intro />
            <IndexPageClient fallbackSuggestions={fallbackSuggestions} />
        </>
    );
};

export default IndexPage;
