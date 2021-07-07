function isTupleOfTwo<T>(t: T[]): t is [T, T] {
    return t.length === 2;
}

export function partsToSpecs(parts?: string | string[]): [string, string] {
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
