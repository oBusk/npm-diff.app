/** Utility to remove all entries that are `undefined`. This is mostly because Next.JS refuses to serialize objects with undefined value */
export default function trimUndefined<T extends Record<string, unknown>>(
    obj: T,
): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== undefined),
    ) as T;
}
