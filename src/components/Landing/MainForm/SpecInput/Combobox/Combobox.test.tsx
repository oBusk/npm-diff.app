/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import Combobox from "./Combobox";

describe("Combobox", () => {
    const setup = async () => {
        const updateQuery = jest.fn((query: string | undefined) => {});

        const utils = render(<Combobox id="test" items={[]} />);

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
});
