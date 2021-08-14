import getSuggestions from "lib/api/npms/suggestions";
import type { ApiVersionsResponse } from "pages/api/versions";
import AUTOCOMPLETE_SIZE from "./autcompleteSize";
import AutocompleteSuggestion from "./AutocompleteSuggestion";
import type { AutocompleteFallback } from "./fallback";
import toAutocompleteSuggestion from "./toAutocompleteSuggestion";

const getAutocompleteSuggestions = async (query: string) => {
    const results = await getSuggestions(query, AUTOCOMPLETE_SIZE);

    return results.map(toAutocompleteSuggestion);
};

const hasAt = /[^@]@\S*$/;

function getAutocompleter(fallback: AutocompleteFallback) {
    return async function autocomplete(
        query: string = "",
    ): Promise<AutocompleteSuggestion[]> {
        if (query === "") {
            return fallback;
        } else if (hasAt.test(query)) {
            const response = await fetch(`/api/versions?spec=${query}`);
            const versions: ApiVersionsResponse = await response.json();

            return versions.map(({ name, version }) => ({
                name: `${name}@${version}`,
            }));
        } else {
            return getAutocompleteSuggestions(query);
        }
    };
}

export default getAutocompleter;
