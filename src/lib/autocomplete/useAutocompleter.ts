import { useCallback } from "react";
import AutocompleteSuggestion from "./AutocompleteSuggestion";
import getAutocompleteSuggestions from "./providers/getAutocompleteSuggestions";
import getAutocompleteVersions from "./providers/getAutocompleteVersions";

const hasAt = /[^@]@\S*$/;

function useAutocompleter(fallback: AutocompleteSuggestion[] = []) {
    return useCallback(
        async function autocomplete(
            query: string = "",
        ): Promise<AutocompleteSuggestion[]> {
            if (query === "") {
                return fallback;
            } else if (hasAt.test(query)) {
                return getAutocompleteVersions(query);
            } else {
                return getAutocompleteSuggestions(query);
            }
        },
        [fallback],
    );
}

export default useAutocompleter;
