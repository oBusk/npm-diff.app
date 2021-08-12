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

    beforeEach(() => {
        throttledFn = throttle(fn, 100);
    });

    it(`Triggers instantly when "clean", otherwise delays.`, () => {
        // Triggers ONCE synchronously
        throttledFn(1);
        throttledFn(2);
        throttledFn(3);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(1);

        // Should not run 2 or 3 until 100ms have passed
        jest.advanceTimersByTime(99);
        expect(fn).toHaveBeenCalledTimes(1);

        // Triggers again with queued calls
        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenCalledWith(3);

        // fn was just exectued from queue, should not execute syncronously
        throttledFn(4);
        expect(fn).toHaveBeenCalledTimes(2);

        // Should trigger 4 after waiting 100ms
        jest.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(3);
        expect(fn).toHaveBeenCalledWith(4);

        // Should execute synchronously if called after more than 100ms
        jest.advanceTimersByTime(100);
        throttledFn(5);
        throttledFn(6);
        expect(fn).toHaveBeenCalledTimes(4);
        expect(fn).toHaveBeenCalledWith(5);
    });
});
