export default function filterUntil<T>(
    items: T[],
    predicate: (item: T, index: number) => boolean,
    maxNumHits: number,
): T[] {
    let result: T[] = [];
    for (let i = 0; i < items.length; i++) {
        if (predicate(items[i], i)) {
            result.push(items[i]);
            if (result.length === maxNumHits) {
                return result;
            }
        }
    }
    return result;
}
