import getPopularPackages from "^/lib/api/npms/popularPackages";
import AUTOCOMPLETE_SIZE from "./autcompleteSize";
import type AutocompleteSuggestion from "./AutocompleteSuggestion";
import packageSuggestion from "./packageSuggestion";

export type AutocompleteFallback = AutocompleteSuggestion[];

async function fallback() {
    const { results } = await getPopularPackages(AUTOCOMPLETE_SIZE);
    const fallback = results.map(packageSuggestion);
    return fallback;
}

export default fallback;
