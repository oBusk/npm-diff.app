/** @jest-environment jsdom */

import { fireEvent, render, screen } from "@testing-library/react";
import Combobox from "./Combobox";

describe("Combobox", () => {
    const setup = async () => {
        const updateQuery = jest.fn((query: string | undefined) => {});

        const utils = render(
            <Combobox id="test" items={[]} updateQuery={updateQuery} />,
        );

        const input: HTMLInputElement = await screen.findByRole("textbox");

        return {
            updateQuery,
            input,
            ...utils,
        };
    };

    it("Renders an input", async () => {
        const { input } = await setup();

        expect(input).toBeInTheDocument();
    });

    it("Calls suggestionFinder on input", async () => {
        const { updateQuery, input } = await setup();

        fireEvent.focus(input);
        fireEvent.input(input, { target: { value: "a" } });

        expect(updateQuery).toHaveBeenCalledTimes(1);
        expect(updateQuery).toHaveBeenCalledWith("a");
    });
});
