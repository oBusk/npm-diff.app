import npa from "npm-package-arg";
import buildVersionMap from "^/lib/api/npm/buildVersionMap";
import type { Version } from "^/lib/api/npm/VersionData";
import getNpmSearchVersions from "^/lib/api/npmSearch/versions";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import type AutocompleteSuggestion from "../AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "../AutocompleteSuggestionTypes";
import { matchVersions } from "./versions/matchVersions";

/**
 * Caches in-flight/resolved lookups by package name, so retyping or
 * refining a spec for the same package (the common case) does not
 * re-query Algolia. Failed lookups are evicted so a transient error
 * doesn't stick for the rest of the session.
 */
const versionsCache = new Map<string, Promise<Version[]>>();

function getVersions(packageName: string): Promise<Version[]> {
    let promise = versionsCache.get(packageName);

    if (!promise) {
        promise = getNpmSearchVersions(packageName)
            .then((result) =>
                result
                    ? Object.entries(
                          buildVersionMap(result.versions, result.tags),
                      ).map(([version, data]) => ({ version, ...data }))
                    : [],
            )
            .catch((): Version[] => {
                versionsCache.delete(packageName);
                return [];
            });
        versionsCache.set(packageName, promise);
    }

    return promise;
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
