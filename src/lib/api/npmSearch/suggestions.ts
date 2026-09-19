import type { HighlightResultOption } from "algoliasearch/lite";
import searchNpmSearch from "./client";
import type NpmSearchHit from "./NpmSearchHit";
import type { NpmSearchRecord } from "./NpmSearchHit";

export type Suggestion = NpmSearchHit & {
    highlight?: string;
};

export default async function getSuggestions(
    query: string,
    size = 25,
): Promise<Suggestion[]> {
    const hits = await searchNpmSearch<NpmSearchRecord>({
        query,
        hitsPerPage: size,
        attributesToHighlight: ["name"],
        attributesToRetrieve: ["name", "description"],
    });

    return hits.map((hit) => {
        const nameResult = hit._highlightResult?.name as
            HighlightResultOption | undefined;

        return {
            ...hit,
            highlight: nameResult?.value,
        };
    });
}
