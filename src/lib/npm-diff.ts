import semver from "semver";
import npa from "npm-package-arg";
import libnpmdiff, { Options, Specs } from "libnpmdiff";

/**
 * Converts two inputs matching what `npm diff --diff=` expects and returns
 * specs such as `package-name@version`.
 *
 * > Based on: https://github.com/npm/cli/blob/v7.19.1/lib/diff.js#L235-L264
 */
function convertVersionsToSpecs([a, b]: [string, string]): [string, string] {
    const semverA = semver.validRange(a);
    const semverB = semver.validRange(b);

    // both specs are semver versions, assume current project dir name
    if (semverA && semverB) {
        throw new Error("One of the specs must contain package name");
    }

    // otherwise uses the name from the other arg to
    // figure out the spec.name of what to compare
    if (!semverA && semverB) return [a, `${npa(a).name}@${b}`];

    if (semverA && !semverB) return [`${npa(b).name}@${a}`, b];

    // no valid semver ranges used
    return [a, b];
}

/**
 * Takes input matching what `npm diff --diff=` expects and returns
 * a diff as text.
 *
 * > Based on: https://github.com/npm/cli/blob/v7.19.1/lib/diff.js#L57-L89
 */
export function npmDiff(input: Specs, options: Options = {}) {
    const [a, b] = convertVersionsToSpecs(input);

    console.log({ a, b });

    return libnpmdiff([a, b], options);
}
