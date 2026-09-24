type SearchParamValue = string | string[] | undefined;

export type SearchParamsRecord<T> = { [K in keyof T]: SearchParamValue };

export function toSearchParams<T extends SearchParamsRecord<T>>(
    query: T,
): URLSearchParams {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries<SearchParamValue>(query)) {
        for (const item of Array.isArray(value) ? value : [value]) {
            if (item != null) {
                searchParams.append(key, item);
            }
        }
    }

    return searchParams;
}

export function toSearchString<T extends SearchParamsRecord<T>>(
    query: T,
): string {
    const search = toSearchParams(query).toString();

    return search.length > 0 ? `?${search}` : "";
}

export function fromSearchParams(
    searchParams: URLSearchParams,
): Record<string, string | string[]> {
    const query: Record<string, string | string[]> = {};

    for (const key of new Set(searchParams.keys())) {
        const values = searchParams.getAll(key);
        query[key] = values.length === 1 ? values[0] : values;
    }

    return query;
}
