import type AutocompleteSuggestion from "./AutocompleteSuggestion";
import type { AutocompleteFallback } from "./fallback";
import getAutocompleteSuggestions from "./providers/getAutocompleteSuggestions";
import getAutocompleteVersions from "./providers/getAutocompleteVersions";

const hasAt = /[^@]@\S*$/;

function getAutocompleter(fallback: AutocompleteFallback) {
    return async function autocomplete(
        query: string = "",
    ): Promise<AutocompleteSuggestion[]> {
        if (query === "") {
            return fallback;
        } else if (hasAt.test(query)) {
            return getAutocompleteVersions(query);
        } else {
            return getAutocompleteSuggestions(query);
        }
    };
}

export default getAutocompleter;
