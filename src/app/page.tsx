import { cacheLife } from "next/cache";
import fallback from "^/lib/autocomplete/fallback";
import Intro from "./_page/Intro";
import { NewFeatureSourceTrust } from "./_page/NewFeatureSourceTrust";
import IndexPageClient from "./page.client";

export interface IndexProps {}

const IndexPage = async ({}: IndexProps) => {
    "use cache";

    cacheLife("max");

    const fallbackSuggestions = await fallback();

    return (
        <>
            <Intro />
            <NewFeatureSourceTrust />
            <IndexPageClient fallbackSuggestions={fallbackSuggestions} />
        </>
    );
};

export default IndexPage;
