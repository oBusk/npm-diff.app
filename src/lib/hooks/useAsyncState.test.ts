/**
 * @jest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react";
import useAsyncState from "./useAsyncState";

describe("useAsyncState", () => {
    it("Should return value and setter", () => {
        const { result } = renderHook(() => useAsyncState(1));

        const [value, setter] = result.current;
        expect(value).toBe(1);
        expect(setter).toBeInstanceOf(Function);
    });

    it("Should return the same setter between renders", () => {
        const { result, rerender } = renderHook(() => useAsyncState(1));

        const [_1, firstSetter] = result.current;
        rerender();
        const [_2, secondSetter] = result.current;

        expect(firstSetter).toBe(secondSetter);
    });

    it("Should update value when inputting normal update", async () => {
        const { result } = renderHook(() => useAsyncState(1));

        const [value, setter] = result.current;
        expect(value).toBe(1);
        await act(() => setter(2));
        const [value2, _setter2] = result.current;
        expect(value2).toBe(2);
    });

    it("Should update value when inputting async update", async () => {
        const { result } = renderHook(() => useAsyncState(1));

        const [value, setter] = result.current;
        expect(value).toBe(1);
        await act(() => setter(Promise.resolve(2)));
        const [value2, _setter2] = result.current;
        expect(value2).toBe(2);
    });

    it("Should update value when inputting timeout update", async () => {
        const { result } = renderHook(() => useAsyncState(1));

        const [value, setter] = result.current;
        expect(value).toBe(1);
        await act(() =>
            setter(new Promise((resolve) => setTimeout(resolve, 10, 2))),
        );
        const [value2, _setter2] = result.current;
        expect(value2).toBe(2);
    });

    it("Cleans up after itself", async () => {
        const { result, unmount } = renderHook(() => useAsyncState(1));

        const [value, setter] = result.current;
        expect(value).toBe(1);
        setter(new Promise((resolve) => setTimeout(resolve, 10, 2)));
        unmount();
        // Just waiting arbitrary time to make sure that the setter should've triggered
        await new Promise((resolve) => setTimeout(resolve, 100));
        const [value2, _setter2] = result.current;
        expect(value2).toBe(1);
    });
});
