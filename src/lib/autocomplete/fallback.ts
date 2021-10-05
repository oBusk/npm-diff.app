import getPopularPackages from "_/lib/api/npms/popularPackages";
import AUTOCOMPLETE_SIZE from "./autcompleteSize";
import AutocompleteSuggestion from "./AutocompleteSuggestion";
import toAutocompleteSuggestion from "./toAutocompleteSuggestion";

export type AutocompleteFallback = AutocompleteSuggestion[];

async function fallback() {
    const { results } = await getPopularPackages(AUTOCOMPLETE_SIZE);
    const fallback = results.map(toAutocompleteSuggestion);
    return fallback;
}

export default fallback;
