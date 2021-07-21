import immutableSpec from "./immutable-spec";

// TODO: Probably remove, MAYBE keep but rename it to immutableSpecs
/**
 * Takes two specs, resolves what version will be used
 * and returns a new spec with the resolved versions
 */
export function getAbsoluteSpecs([a, b]: [string, string]): Promise<
    [string, string]
> {
    return Promise.all([immutableSpec(a), immutableSpec(b)]);
}

export default getAbsoluteSpecs;
