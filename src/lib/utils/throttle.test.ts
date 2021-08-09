import throttle from "./throttle";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("throttle", () => {
    let fn: (n: number) => void;
    let throttledFn: typeof fn;

    beforeEach(() => {
        jest.useFakeTimers();
        fn = jest.fn(() => {});
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe("leading = false", () => {
        beforeEach(() => {
            throttledFn = throttle(fn, 100, false);
        });

        it(`does not run synchronously`, () => {
            throttledFn(1);
            throttledFn(2);
            throttledFn(3);
            expect(fn).toHaveBeenCalledTimes(0);
        });

        it(`runs ONCE after waiting "time"`, () => {
            throttledFn(1);
            throttledFn(2);
            throttledFn(3);
            expect(fn).toHaveBeenCalledTimes(0);
            jest.advanceTimersByTime(100);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(3);

            jest.advanceTimersByTime(300);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(3);
        });
    });

    describe("`leading=true`", () => {
        beforeEach(() => {
            throttledFn = throttle(fn, 100, true);
        });

        it(`Triggers ONCE instantly if "leading" = true`, () => {
            throttledFn(1);
            throttledFn(2);
            throttledFn(3);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(1);
        });

        it(`Triggers ONCE again after waiting time`, () => {
            throttledFn(1);
            throttledFn(2);
            throttledFn(3);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(1);
            jest.advanceTimersByTime(100);
            expect(fn).toHaveBeenCalledTimes(2);
            expect(fn).toHaveBeenCalledWith(3);
        });
    });
});
