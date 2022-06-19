function isTupleOfTwo<T>(t: T[]): t is [T, T] {
    return t.length === 2;
}

/**
 * Takes the weird "parts" that we get from the next.js query does necessary
 * merging and returns a tuple with two specs/versions.
 *
 * @examples
 *
 * `package...1.0.0` ➡ `['package', '1.0.0']`
 *
 * `['@types', 'package@^1...@types', 'package@^2']` ➡ `['@types/package@^1', '@types/package@^2']`
 */
function splitParts(parts?: string | string[]): [string] | [string, string] {
    const invalidQueryError = () => new Error("Invalid query");

    if (
        !(
            typeof parts === "string" ||
            (Array.isArray(parts) &&
                parts.every((p) => typeof p === "string") &&
                // two scoped specs "@a/p@1...@a/p@2".split('/') -> ["@a", "p@1...@a", "p@2"]
                parts.length <= 3)
        )
    ) {
        throw invalidQueryError();
    }

    const query = typeof parts === "string" ? parts : parts.join("/");

    const splitted = query.split("...");

    if (splitted.length == 1) {
        return [splitted[0]];
    } else if (splitted.length === 2) {
        return [splitted[0], splitted[1]];
    } else {
        throw invalidQueryError();
    }
}

export default splitParts;
