import npa from "npm-package-arg";
import getVersionsFromNpmSearch from "^/lib/api/npmSearch/versions";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import type AutocompleteSuggestion from "../AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "../AutocompleteSuggestionTypes";
import buildVersions from "./versions/buildVersions";
import { matchVersions } from "./versions/matchVersions";
import type { Version } from "./versions/Version";

async function getVersions(packageName: string): Promise<Version[]> {
    const result = await getVersionsFromNpmSearch(packageName);

    return result ? buildVersions(result.versions, result.tags) : [];
}

const npaSafe = (input: string): npa.Result => {
    try {
        return npa(input);
    } catch {
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

    const versions = await getVersions(name);

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
    }).map(({ version, versionEmphasized, tags, time }) => {
        return {
            type: AutocompleteSuggestionTypes.Version,
            value: `${name}@${version}`,
            name,
            version: versionEmphasized,
            tags,
            time,
        };
    });
}

export default getAutocompleteVersions;
