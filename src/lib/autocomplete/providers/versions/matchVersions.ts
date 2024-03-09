import { lt, major, minor, prerelease, rcompare, satisfies } from "semver";
import { type Version } from "^/app/api/-/versions/types";

export interface Matched {
    version: string;
    versionEmphasized: string;
    tags?: string[];
    time?: string;
}

const escapeRegex = (string: string) =>
    string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

const emphasize = (fullStr: string, subStr?: string) =>
    subStr?.length
        ? fullStr.replace(new RegExp(escapeRegex(subStr)), `<em>${subStr}</em>`)
        : fullStr;

const getEligbleVersions = ({
    versions,
    rawSpec,
    optionalFilter,
}: {
    versions: ReadonlyArray<Version>;
    rawSpec: string;
    optionalFilter?: string;
}): Version[] => {
    if (rawSpec !== "") {
        // If there is a spec, filter all version/tags that matches
        versions = versions.filter(
            ({ version, tags }) =>
                version.startsWith(rawSpec) ||
                satisfies(version, rawSpec) ||
                tags?.some((tag) => tag.startsWith(rawSpec)),
        );
    }

    const nonPrereleaseVersions = versions.filter(
        ({ version }) => !prerelease(version),
    );

    if (nonPrereleaseVersions.length > 0) {
        // There is at least one non-prerelease version, so don't show prerelease versions
        versions = nonPrereleaseVersions;
    }

    if (optionalFilter != null) {
        const greaterThanVersions = versions.filter(({ version }) =>
            satisfies(version, optionalFilter),
        );

        if (greaterThanVersions.length > 0) {
            // There is at least one version that matches the optional filter
            versions = greaterThanVersions;
        }
        // If there is no version that matches the optional filter, ignore it
    }

    // Slice to guarantee new array
    return versions.slice();
};

/**
 * Loops over `versions` and extracts
 *
 * - `0` The latest version
 * - `1` The version before `[0]`
 * - `2` The previous minor before `[1]`
 * - `3` The previous major before `[2]`
 */
function findPreviousReleases(versions: readonly Version[]): Version[] {
    const result: Version[] = [];

    versionsLoop: for (let entry of versions) {
        switch (result.length) {
            case 0:
            // We have no entries, so this is the first entry
            case 1:
                // We have one entry, this is the release before it
                result.push(entry);
                break;
            case 2:
                // We have two entries (release and last version before it)
                // We want to find a release that is less than the last versions minor
                if (
                    lt(
                        entry.version,
                        [
                            major(result[1].version),
                            minor(result[1].version),
                            0,
                        ].join("."),
                    )
                ) {
                    // Current minor is less than the previous entry
                    result.push(entry);
                }
                break;
            case 3:
                // We have three entries, (release, last version before it, last minor before previous)
                // We want to find a release that is less than the last versions major
                if (
                    lt(
                        entry.version,
                        [major(result[2].version), 0, 0].join("."),
                    )
                ) {
                    // Current major is less than the previous entry
                    result.push(entry);
                }
                break;
            default:
                break versionsLoop;
        }
    }

    return result;
}

/**
 * Takes input parameters and and source and returns a subset of the source.
 */
export function matchVersions({
    rawSpec,
    versions,
    size,
    optionalFilter,
}: {
    /** from `npa`. Like `1`, `1.2`, `1.2.3`, or `latest` */
    rawSpec: string;
    versions: ReadonlyArray<Version>;
    size: number;
    /**
     * Semver filter, to be passed into `semver.satisfies()`. If specified,
     * will try to find versions that are within semver range.
     *
     * "Optional" because if there are no matches, filter is ignored.
     */
    optionalFilter?: string;
}): Matched[] {
    /** Array of all versions that matches the string */
    const eligibleVersions = getEligbleVersions({
        versions,
        rawSpec,
        optionalFilter,
    }).reverse();

    if (eligibleVersions.length === 0) {
        return [];
    }

    const matches = findPreviousReleases(eligibleVersions);

    if (matches.length < size) {
        // There wasn't enough matches from the previous mechanics, lets add some more.

        for (let entry of eligibleVersions) {
            if (!matches.includes(entry)) {
                matches.push(entry);
            }

            if (matches.length >= size) {
                // we have enough
                break;
            }
        }
    }

    return matches
        .sort((a, b) => rcompare(a.version, b.version))
        .map(({ version, tags, time }) => ({
            version,
            versionEmphasized: emphasize(version, rawSpec),
            ...(tags
                ? { tags: tags.map((tag) => emphasize(tag, rawSpec)) }
                : undefined),
            time,
        }));
}
