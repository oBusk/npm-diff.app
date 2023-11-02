import getSuggestions from "^/lib/api/npms/suggestions";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import type AutocompleteSuggestion from "../AutocompleteSuggestion";
import packageSuggestion from "../packageSuggestion";

async function getAutocompleteSuggestions(
    query: string,
): Promise<AutocompleteSuggestion[]> {
    const results = await getSuggestions(query, AUTOCOMPLETE_SIZE);

    return results.map(packageSuggestion);
}

export default getAutocompleteSuggestions;
