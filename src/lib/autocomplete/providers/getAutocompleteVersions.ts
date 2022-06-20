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
    /**
     * E.g `package@^1.2.3` or `package@>1.2.3`
     *
     * To help pick better results when showing versions for `package`.
     *
     * If `input` is a different package, _or_ no matching versions are found,
     * this filter is ignored
     */
    optionalPackageFilter?: string,
): Promise<AutocompleteSuggestion[]> {
    const { name, rawSpec } = npa(input);
    const optionalFilterNpa =
        optionalPackageFilter && npa(optionalPackageFilter);

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
        // Only provide `optionalFilter` if `optionalFilter` is same package as `input`
        optionalFilter:
            (optionalFilterNpa &&
                optionalFilterNpa?.name === name &&
                optionalFilterNpa.rawSpec) ||
            undefined,
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
