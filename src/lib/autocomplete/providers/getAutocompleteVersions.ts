import npa from "npm-package-arg";
import type { ApiVersionsResponse } from "pages/api/versions";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import AutocompleteSuggestion from "../AutocompleteSuggestion";

async function getAutocompleteVersions(
    query: string,
): Promise<AutocompleteSuggestion[]> {
    const { name } = npa(query);

    const response = await fetch(`/api/versions?spec=${name}`);
    const versions: ApiVersionsResponse = await response.json();

    return versions
        .reverse()
        .slice(0, AUTOCOMPLETE_SIZE)
        .map(({ name, version }) => ({
            name: `${name}@${version}`,
        }));
}

export default getAutocompleteVersions;
