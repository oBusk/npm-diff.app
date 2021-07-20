import npa from "npm-package-arg";
import semver from "semver";
import pacote from "pacote";

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
 * Takes two specs, resolves what version will be used
 * and returns a new spec with the resolved versions
 */
export async function getAbsoluteSpecs(
    input: [string, string],
): Promise<[string, string]> {
    // Use the same mechanics as `npm diff` to get base specs
    const specs = convertVersionsToSpecs(input);

    if (
        specs.map((spec) => npa(spec).type).every((type) => type === "version")
    ) {
        // both are version specs, so we can just return the input

        return specs;
    } else {
        // Either of the specs are not version specs, so we need to resolve

        // https://github.com/npm/libnpmdiff/blob/v2.0.4/index.js#L16-L20
        const [aManifest, bManifest] = await Promise.all(
            specs.map((spec) => pacote.manifest(spec)),
        );

        return [
            `${aManifest.name}@${aManifest.version}`,
            `${bManifest.name}@${bManifest.version}`,
        ];
    }
}

export default getAbsoluteSpecs;
