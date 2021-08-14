import AUTOCOMPLETE_SIZE from "./autcompleteSize";
import toAutocompleteSuggestion from "./toAutocompleteSuggestion";
import getPopularPackages from "lib/npms/popularPackages";
import AutocompleteSuggestion from "./AutocompleteSuggestion";

export type AutocompleteFallback = AutocompleteSuggestion[];

async function fallback() {
    const { results } = await getPopularPackages(AUTOCOMPLETE_SIZE);
    const fallback = results.map(toAutocompleteSuggestion);
    return fallback;
}

export default fallback;
