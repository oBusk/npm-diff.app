type SearchParamValue = string | string[] | undefined;

type SearchParamsRecord<T> = { [K in keyof T]: SearchParamValue };

export function toSearchString<T extends SearchParamsRecord<T>>(
    query: T,
): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries<SearchParamValue>(query)) {
        for (const item of Array.isArray(value) ? value : [value]) {
            if (item != null) {
                searchParams.append(key, item);
            }
        }
    }

    const search = searchParams.toString();

    return search.length > 0 ? `?${search}` : "";
}

export function fromSearchParams(
    searchParams: URLSearchParams,
): Record<string, string | string[]> {
    // Object.fromEntries defines own properties, so a `__proto__` key can't
    // replace the prototype.
    return Object.fromEntries(
        [...new Set(searchParams.keys())].map((key) => {
            const values = searchParams.getAll(key);
            return [key, values.length === 1 ? values[0] : values];
        }),
    );
}
