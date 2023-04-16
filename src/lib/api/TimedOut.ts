import wait from "^/lib/utils/wait";

export const DEFAULT_TIMEOUT = 9_000;

const TIMED_OUT = "TIMED_OUT" as const;
type TIMED_OUT = typeof TIMED_OUT;

export default TIMED_OUT;

export function resultOrTimedOut<T extends Promise<unknown>>(source: T) {
    return Promise.race([wait(DEFAULT_TIMEOUT).then(() => TIMED_OUT), source]);
}
