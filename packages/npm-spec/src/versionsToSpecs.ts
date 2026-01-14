import npa from "npm-package-arg";
import semver from "semver";

/**
 * `npm diff` supports taking both `--diff` inputs as versions and/or semver
 * which then defaults to the current directory. It also supports
 * one of the `--diff` to be only semver/version, and then uses the package
 * name from the other input.
 *
 * We don't care about the "current package.json" usecase, but we want to
 * support specifying only the version in one of the inputs.
 *
 * This does the version-handling that `npm/cli` does, but removing alot of
 * fallbacks to local directory.
 *
 * > Based on: https://github.com/npm/cli/blob/v7.19.1/lib/diff.js#L235-L264
 */
function versionsToSpecs([a, b]:
    | readonly [string, string]
    | readonly [string]): [string, string] {
    const semverA = semver.validRange(a);

    if (!b) {
        if (semverA) {
            throw new Error("Missing package name");
        }

        return [a, `${npa(a).name}@latest`];
    }

    const semverB = semver.validRange(b);

    // We cannot support both args being only versions, we need a package name
    if (semverA && semverB) {
        throw new Error("One of the specs must contain package name");
    }

    // otherwise uses the name from the other arg to
    // figure out the spec.name of what to compare
    if (!semverA && semverB) {
        return [a, `${npa(a).name}@${b}`];
    }

    if (semverA && !semverB) {
        return [`${npa(b).name}@${a}`, b];
    }

    // no valid semver ranges used
    return [a, b];
}

export default versionsToSpecs;
