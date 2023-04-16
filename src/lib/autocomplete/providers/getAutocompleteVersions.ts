import npa from "npm-package-arg";
import {
    SpecsEndpointResponse,
    VERSIONS_PARAMETER_PACKAGE,
} from "^/app/api/versions/types";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import AutocompleteSuggestion from "../AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "../AutocompleteSuggestionTypes";
import { matchVersions } from "./versions/matchVersions";

const npaSafe = (input: string): npa.Result => {
    try {
        return npa(input);
    } catch (e) {
        if (input.length > 1) {
            return npaSafe(input.slice(0, -1));
        } else {
            return npa("");
        }
    }
};

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
    const { name, rawSpec } = npaSafe(input);

    const optionalFilterNpa =
        optionalPackageFilter && npaSafe(optionalPackageFilter);

    if (!name) {
        throw new Error("No package name provided");
    }

    const url = `/api/versions?${new URLSearchParams({
        [VERSIONS_PARAMETER_PACKAGE]: name,
    }).toString()}`;
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
