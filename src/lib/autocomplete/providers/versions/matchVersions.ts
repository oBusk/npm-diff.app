import { lt, major, minor, rcompare } from "semver";
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

// TODO: This method is very badly optimized.
/**
 * Takes input parameters and and source and returns a subset of the source.
 */
export function matchVersions({
    rawSpec,
    versions,
    size,
}: {
    /** from `npa`. Like `1`, `1.2`, `1.2.3`, or `latest` */
    rawSpec: string;
    versions: ReadonlyArray<Version>;
    size: number;
}): Matched[] {
    /** Array of all versions that matches the string */
    const eligibleVersions = (
        rawSpec === ""
            ? versions.slice()
            : versions.filter(
                  ({ version, tags }: Version) =>
                      version.startsWith(rawSpec) ||
                      tags?.some((tag) => tag.startsWith(rawSpec)),
              )
    ).reverse();

    if (eligibleVersions.length === 0) {
        return [];
    }

    const latestMatch = eligibleVersions[0];

    const previousPatch = eligibleVersions.find(({ version }) =>
        lt(version, latestMatch.version),
    );

    const previousMinor =
        previousPatch &&
        eligibleVersions.find(({ version }) =>
            lt(
                version,
                `${major(previousPatch.version)}.${minor(
                    previousPatch.version,
                )}.0`,
            ),
        );

    const previousMajor =
        previousMinor &&
        eligibleVersions.find(({ version }) =>
            lt(version, `${major(previousMinor.version)}.0.0`),
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
