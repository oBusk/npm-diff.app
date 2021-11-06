import npa from "npm-package-arg";
import { VersionsEndpointResponse } from "^/lib/middleware";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import AutocompleteSuggestion from "../AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "../AutocompleteSuggestionTypes";
import { matchVersions } from "./versions/matchVersions";

async function getAutocompleteVersions(
    input: string,
): Promise<AutocompleteSuggestion[]> {
    const { name, rawSpec } = npa(input);

    if (!name) {
        throw new Error("No package name provided");
    }

    const response = await fetch(`/api/versions?spec=${name}`);
    const versions: VersionsEndpointResponse = await response.json();

    return matchVersions({ rawSpec, versions, size: AUTOCOMPLETE_SIZE }).map(
        (version) => ({
            type: AutocompleteSuggestionTypes.Version,
            value: `${name}@${version}`,
            title: `${name}@${version}`,
            titleWithHighlight: `<em>${name}@${rawSpec}</em>${version.slice(
                rawSpec.length,
            )}`,
            packageName: name,
        }),
    );
}

export default getAutocompleteVersions;
