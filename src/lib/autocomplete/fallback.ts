import getPopularPackages from "^/lib/api/npmSearch/popularPackages";
import AUTOCOMPLETE_SIZE from "./autcompleteSize";
import type AutocompleteSuggestion from "./AutocompleteSuggestion";
import packageSuggestion from "./packageSuggestion";

export type AutocompleteFallback = AutocompleteSuggestion[];

async function fallback() {
    try {
        const hits = await getPopularPackages(AUTOCOMPLETE_SIZE);
        return hits.map(packageSuggestion);
    } catch {
        return [];
    }
}

export default fallback;
