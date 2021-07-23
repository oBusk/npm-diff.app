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
function splitParts(parts?: string | string[]): [string, string] {
    if (!parts || (typeof parts !== "string" && !Array.isArray(parts))) {
        throw new Error("Invalid query");
    }

    const query = typeof parts === "string" ? parts : parts.join("/");

    const splitted = query.split("...");

    if (!isTupleOfTwo(splitted)) {
        throw new Error("Invalid query");
    }

    return splitted;
}

export default splitParts;
