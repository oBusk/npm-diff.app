import semver from "semver";
import npa from "npm-package-arg";
import libnpmdiff from "libnpmdiff";

// https://github.com/npm/cli/blob/v7.19.1/lib/diff.js#L235-L264
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

// https://github.com/npm/cli/blob/v7.19.1/lib/diff.js#L57-L89
async function diff(specs: [string, string]) {
    const [a, b] = convertVersionsToSpecs(specs);

    const res = await libnpmdiff([a, b], {
        // ...this.npm.flatOptions,
        // diffFiles: args,
        // where: this.top,
    });

    return res;
}

export async function queryToDiff(parts: string | string[]): Promise<string> {
    const query = typeof parts === "string" ? parts : parts.join("/");

    const [q1, q2] = query.split("...");

    return diff([q1, q2]);
}
