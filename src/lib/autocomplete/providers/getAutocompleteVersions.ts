import npa from "npm-package-arg";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import AutocompleteSuggestion from "../AutocompleteSuggestion";
import type { ApiVersionsResponse } from "-/pages/api/versions";

async function getAutocompleteVersions(
    query: string,
): Promise<AutocompleteSuggestion[]> {
    const { name, rawSpec } = npa(query);

    const response = await fetch(`/api/versions?spec=${name}`);
    const versions: ApiVersionsResponse = await response.json();

    return (
        versions
            .reverse()
            // TODO: Instead of just using `filter()` here, we should have some util
            // to "filter until". Since we only care about the first `AUTOCOMPLETE_SIZE`
            // number of hits, we want to stop running once we've found that many.
            .filter(({ version }) => version.startsWith(rawSpec))
            .slice(0, AUTOCOMPLETE_SIZE)
            .map(({ name, version }) => ({
                name: `${name}@${version}`,
            }))
    );
}

export default getAutocompleteVersions;
