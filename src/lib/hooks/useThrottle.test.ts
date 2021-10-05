/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react-hooks";
import * as throttle from "../utils/throttle";
import useThrottle from "./useThrottle";

describe("useThrottle", () => {
    let fn: (n: number) => void;

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

    it(`Triggers instantly when "clean", otherwise delays.`, () => {
        const { result, rerender } = renderHook(() =>
            useThrottle(fn, 100, false),
        );

        // Triggers ONCE synchronously
        result.current(1);
        result.current(2);
        result.current(3);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(1);

        rerender();

        // Should not run 2 or 3 until 100ms have passed
        jest.advanceTimersByTime(99);
        expect(fn).toHaveBeenCalledTimes(1);

        // Triggers again with queued calls
        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenCalledWith(3);

        // fn was just exectued from queue, should not execute syncronously
        result.current(4);
        expect(fn).toHaveBeenCalledTimes(2);

        rerender();

        // Should trigger 4 after waiting 100ms
        jest.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(3);
        expect(fn).toHaveBeenCalledWith(4);

        // Should execute synchronously if called after more than 100ms
        jest.advanceTimersByTime(100);
        result.current(5);
        result.current(6);
        expect(fn).toHaveBeenCalledTimes(4);
        expect(fn).toHaveBeenCalledWith(5);
    });
});
