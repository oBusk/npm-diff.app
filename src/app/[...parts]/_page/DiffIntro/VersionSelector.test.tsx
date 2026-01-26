// @jest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import VersionSelector from "./VersionSelector";

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("VersionSelector", () => {
    const mockPush = jest.fn();
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    it("renders loading state initially", () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        } as Response);

        render(
            <VersionSelector
                currentSpec={{ name: "react", version: "18.0.0" }}
                otherSpec={{ name: "react", version: "17.0.0" }}
                side="a"
            />,
        );

        expect(screen.getByText("18.0.0")).toBeInTheDocument();
    });

    it("fetches and displays versions", async () => {
        const mockVersions = [
            { version: "18.2.0", time: "2023-01-01" },
            { version: "18.1.0", time: "2022-12-01" },
            { version: "18.0.0", time: "2022-11-01" },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockVersions,
        } as Response);

        render(
            <VersionSelector
                currentSpec={{ name: "react", version: "18.0.0" }}
                otherSpec={{ name: "react", version: "17.0.0" }}
                side="a"
            />,
        );

        await waitFor(() => {
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.value).toBe("18.0.0");
    });

    it("navigates to new diff when version is selected (side a)", async () => {
        const mockVersions = [
            { version: "18.2.0", time: "2023-01-01" },
            { version: "18.0.0", time: "2022-11-01" },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockVersions,
        } as Response);

        const { container } = render(
            <VersionSelector
                currentSpec={{ name: "react", version: "18.0.0" }}
                otherSpec={{ name: "react", version: "17.0.0" }}
                side="a"
            />,
        );

        await waitFor(() => {
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        const select = container.querySelector("select");
        if (select) {
            select.value = "18.2.0";
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(
                "/react@18.2.0...react@17.0.0",
            );
        });
    });

    it("navigates to new diff when version is selected (side b)", async () => {
        const mockVersions = [
            { version: "18.2.0", time: "2023-01-01" },
            { version: "17.0.0", time: "2022-11-01" },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockVersions,
        } as Response);

        const { container } = render(
            <VersionSelector
                currentSpec={{ name: "react", version: "17.0.0" }}
                otherSpec={{ name: "react", version: "18.0.0" }}
                side="b"
            />,
        );

        await waitFor(() => {
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        const select = container.querySelector("select");
        if (select) {
            select.value = "18.2.0";
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(
                "/react@18.0.0...react@18.2.0",
            );
        });
    });

    it("displays version tags when available", async () => {
        const mockVersions = [
            {
                version: "18.2.0",
                time: "2023-01-01",
                tags: ["latest", "next"],
            },
            { version: "18.0.0", time: "2022-11-01" },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockVersions,
        } as Response);

        render(
            <VersionSelector
                currentSpec={{ name: "react", version: "18.0.0" }}
                otherSpec={{ name: "react", version: "17.0.0" }}
                side="a"
            />,
        );

        await waitFor(() => {
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        // Check if option with tags exists
        const option = screen.getByText("18.2.0 (latest, next)");
        expect(option).toBeInTheDocument();
    });
});
