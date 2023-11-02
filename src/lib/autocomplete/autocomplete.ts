import type AutocompleteSuggestion from "./AutocompleteSuggestion";
import getAutocompleteSuggestions from "./providers/getAutocompleteSuggestions";
import getAutocompleteVersions from "./providers/getAutocompleteVersions";

const hasAt = /[^@]@\S*$/;

async function autocomplete({
    query = "",
    optionalPackageFilter,
}: {
    query?: string;
    optionalPackageFilter?: string;
}): Promise<AutocompleteSuggestion[]> {
    if (hasAt.test(query)) {
        return getAutocompleteVersions(query, optionalPackageFilter);
    } else {
        return getAutocompleteSuggestions(query);
    }
}

export default autocomplete;
