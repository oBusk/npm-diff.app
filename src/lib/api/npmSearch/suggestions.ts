import searchNpmSearch from "./client";
import type NpmSearchHit from "./NpmSearchHit";

export type Suggestion = NpmSearchHit & {
    highlight?: string;
};

export default async function getSuggestions(
    query: string,
    size = 25,
): Promise<Suggestion[]> {
    const hits = await searchNpmSearch<NpmSearchHit>({
        query,
        hitsPerPage: size,
        attributesToHighlight: ["name"],
        attributesToRetrieve: ["name", "description"],
    });

    return hits.map((hit) => ({
        ...hit,
        highlight: hit._highlightResult?.name?.value,
    }));
}
