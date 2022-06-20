import { lte } from "lodash";
import { major, minor, patch, prerelease, rcompare, satisfies } from "semver";
import { Version } from "^/lib/middleware";

export interface Matched {
    version: string;
    versionEmphasized: string;
    tags?: string[];
}

const emphasize = (fullStr: string, subStr?: string) =>
    subStr?.length
        ? fullStr.replace(new RegExp(subStr), `<em>${subStr}</em>`)
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

// TODO: This method is very badly optimized.
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

    const latestMatch = eligibleVersions[0];

    const previousPatch = eligibleVersions.find(({ version }) =>
        lte(
            version,
            [
                major(latestMatch.version),
                minor(latestMatch.version),
                patch(latestMatch.version) - 1,
            ].join("."),
        ),
    );

    const previousMinor =
        previousPatch &&
        eligibleVersions.find(({ version }) =>
            lte(
                version,
                [
                    major(previousPatch.version),
                    minor(previousPatch.version) - 1,
                    Number.MAX_SAFE_INTEGER,
                ].join("."),
            ),
        );

    const previousMajor =
        previousMinor &&
        eligibleVersions.find(({ version }) =>
            lte(
                version,
                [
                    major(previousMinor.version) - 1,
                    Number.MAX_SAFE_INTEGER,
                    Number.MAX_SAFE_INTEGER,
                ].join("."),
            ),
        );

    const matches = [
        latestMatch,
        previousPatch,
        previousMinor,
        previousMajor,
    ].filter((x): x is Version => x != null);

    while (matches.length < size) {
        // There wasn't enough matches from the previous mechanics, lets add some more.

        // Any entry that startswith the rawSpec and isn't already in the array.
        const found = eligibleVersions.find(
            (entry) => !matches.includes(entry),
        );

        if (found) {
            matches.push(found);
        } else {
            // We've exhausted all the options.
            break;
        }
    }

    return matches
        .sort((a, b) => rcompare(a.version, b.version))
        .map(({ version, tags }) => ({
            version,
            versionEmphasized: emphasize(version, rawSpec),
            ...(tags
                ? { tags: tags.map((tag) => emphasize(tag, rawSpec)) }
                : undefined),
        }));
}
