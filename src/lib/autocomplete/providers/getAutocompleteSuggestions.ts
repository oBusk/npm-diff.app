import getSuggestions from "_/lib/api/npms/suggestions";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import AutocompleteSuggestion from "../AutocompleteSuggestion";
import toAutocompleteSuggestion from "../toAutocompleteSuggestion";

async function getAutocompleteSuggestions(
    query: string,
): Promise<AutocompleteSuggestion[]> {
    const results = await getSuggestions(query, AUTOCOMPLETE_SIZE);

    return results.map(toAutocompleteSuggestion);
}

export default getAutocompleteSuggestions;
