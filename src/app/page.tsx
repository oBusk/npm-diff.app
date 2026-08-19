import { cacheLife } from "next/cache";
import fallback from "^/lib/autocomplete/fallback";
import FeatureCards from "./_page/FeatureCards";
import Intro from "./_page/Intro";
import IndexPageClient from "./page.client";

export interface IndexProps {}

const IndexPage = async ({}: IndexProps) => {
    "use cache";

    cacheLife("max");

    const fallbackSuggestions = await fallback();

    return (
        <>
            <Intro className="mt-14 mb-10" />
            <IndexPageClient fallbackSuggestions={fallbackSuggestions} />
            <FeatureCards />
        </>
    );
};

export default IndexPage;
