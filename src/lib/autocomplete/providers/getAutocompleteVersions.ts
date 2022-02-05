import npa from "npm-package-arg";
import {
    SpecsEndpointResponse,
    VERSIONS_PARAMETER_SPEC,
    VERSIONS_PATH,
} from "^/lib/middleware";
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

    const url = `${VERSIONS_PATH}?${VERSIONS_PARAMETER_SPEC}=${name}` as const;
    const response = await fetch(url);
    const versions: SpecsEndpointResponse = await response.json();

    return matchVersions({
        rawSpec,
        versions,
        size: AUTOCOMPLETE_SIZE,
    }).map(({ version, versionEmphasized, tags }) => {
        return {
            type: AutocompleteSuggestionTypes.Version,
            value: `${name}@${version}`,
            name,
            version: versionEmphasized,
            tags,
        };
    });
}

export default getAutocompleteVersions;
