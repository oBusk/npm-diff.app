export default function filterUntil<T>(
    items: ReadonlyArray<T>,
    predicate: (item: T, index: number) => boolean,
    maxNumHits: number,
): T[] {
    let result: T[] = [];
    for (let i = 0; i < items.length; i++) {
        if (result.length >= maxNumHits) {
            return result;
        }
        if (predicate(items[i], i)) {
            result.push(items[i]);
        }
    }
    return result;
}
