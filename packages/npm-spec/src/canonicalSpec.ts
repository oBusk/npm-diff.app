import npa, { type AliasResult } from "npm-package-arg";
import pacote from "pacote";

const hashFinder = /(?:\#.*)?$/;

// Separate method to allow recursive use for `type="alias"`
async function handleNpaResult(result: npa.Result): Promise<string> {
    switch (result.type) {
        case "version":
            return result.toString();
        case "tag":
        case "range":
            const { name, version } = await pacote.manifest(result.toString());

            return `${name}@${version}`;
        case "alias":
            return handleNpaResult((result as AliasResult).subSpec);
        case "git":
            // TODO: Would be nice if we could figure out a tag and use that when possible.

            const resolved = await pacote.resolve(result.toString());
            const resolvedHash = resolved.match(hashFinder)?.[0];

            if (!resolvedHash) {
                throw new Error("Spec type git: Failed to resolve hash");
            }

            return result.toString().replace(hashFinder, resolvedHash);
        case "remote":
            // TODO: Would be nice if we could figure out a tag and use that when possible.

            return pacote.resolve(result.toString());
        case "directory":
        case "file":
        default:
            throw new Error(
                `Unsupported registry specifier type: "${result.type}"`,
            );
    }
}

/**
 * Takes a single registry specifier ("spec") and returns a "canonical"
 * registry specifier.
 *
 * An "canonical" registry specifier is a registry specifer that will always
 * return the same package.
 *
 * - Takes registry specifier of type `version` and returns it instantly, it is already canonical.
 * - Takes registry specifier of type `tag` or `range` and returns with version.
 * - Takes registry specifier of type `git`, `remote` and returns with commit.
 * - Takes registry specifier of type `alias` and resolves sub spec.
 * - Throws on specifier of type `directory` or `file`.
 *
 * # Read More
 *
 * - https://github.com/npm/npm-package-arg#result-object
 * - https://docs.npmjs.com/cli/v7/commands/npm-install
 */
async function canonicalSpec(spec: string): Promise<string> {
    const result = npa(spec);

    return handleNpaResult(result);
}

export default canonicalSpec;
