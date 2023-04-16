async function measuredPromise<T>(source: Promise<T>): Promise<{
    result: T;
    time: number;
}> {
    const start = Date.now();
    const result = await source;
    return { result, time: Date.now() - start };
}

export default measuredPromise;
