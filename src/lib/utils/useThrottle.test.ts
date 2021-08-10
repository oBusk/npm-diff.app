import { renderHook, RenderResult } from "@testing-library/react-hooks";
import useThrottle from "./useThrottle";
import * as throttle from "./throttle";

describe("useThrottle", () => {
    let fn: (n: number) => void;
    let throttledFn: RenderResult<(n: number) => void>;

    beforeEach(() => {
        jest.useFakeTimers();
        fn = jest.fn((n: number) => {});
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("returns the same object between renders", () => {
        const { result, rerender } = renderHook(() =>
            useThrottle(() => {}, 100, false),
        );
        const first = result.current;
        rerender();
        const second = result.current;
        expect(first).toBe(second);
    });

    it("doesn't call 'throttle' multiple times", () => {
        const mock = jest.spyOn(throttle, "default");

        const { result, rerender } = renderHook(() =>
            useThrottle(() => {}, 100, false),
        );
        const first = result.current;
        rerender();
        const second = result.current;
        expect(first).toBe(second);

        expect(mock).toHaveBeenCalledTimes(1);

        mock.mockRestore();
    });

    describe("leading=false", () => {
        beforeEach(() => {
            ({ result: throttledFn } = renderHook(() =>
                useThrottle(fn, 100, false),
            ));
        });

        it("Does not trigger synchronously", () => {
            throttledFn.current(1);
            throttledFn.current(2);
            throttledFn.current(3);
            expect(fn).not.toHaveBeenCalled();
        });

        it("Triggers ONCE after waiting", () => {
            throttledFn.current(1);
            throttledFn.current(2);
            throttledFn.current(3);
            expect(fn).not.toHaveBeenCalled();
            jest.advanceTimersByTime(100);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(3);
            jest.advanceTimersByTime(300);
            expect(fn).toHaveBeenCalledTimes(1);
        });
    });
});
