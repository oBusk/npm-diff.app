// @jest-environment jsdom

import { render, screen } from "@testing-library/react";
import ExternalLink from "./ExternalLink";

describe("ExternalLink", () => {
    it("has noreferrer noopener", () => {
        render(
            <ExternalLink href="https://example.com">
                Example Link
            </ExternalLink>,
        );

        const link = screen.getByText("Example Link");

        expect(link).toHaveAttribute("rel", "noreferrer noopener");
    });
});
