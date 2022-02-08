/** @jest-environment jsdom */

import { act, fireEvent, render, screen } from "@testing-library/react";
import Combobox from "./Combobox";

describe("Combobox", () => {
    const setup = async () => {
        const suggestionPromise = new Promise<{ value: string }[]>((resolve) =>
            resolve([{ value: "a" }, { value: "b" }]),
        );

        const suggestionFinder = jest.fn(
            (query: string | undefined) => suggestionPromise,
        );

        const utils = render(
            <Combobox id="test" suggestionFinder={suggestionFinder} />,
        );

        const input: HTMLInputElement = await screen.findByRole("textbox");

        return {
            suggestionPromise,
            suggestionFinder,
            input,
            ...utils,
        };
    };

    it("Renders an input", async () => {
        const { input } = await setup();

        expect(input).toBeInTheDocument();
    });

    it("Calls suggestionFinder on input", async () => {
        const { suggestionPromise, suggestionFinder, input } = await setup();

        fireEvent.focus(input);
        fireEvent.input(input, { target: { value: "a" } });

        expect(suggestionFinder).toHaveBeenCalledTimes(1);
        expect(suggestionFinder).toHaveBeenCalledWith("a");

        await act(() => suggestionPromise.then(() => {}));
    });
});
