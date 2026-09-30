import { render, screen } from "@testing-library/react";
import type { CatalogLatestVersion } from "^/lib/api/npm/catalogSummary";
import PackageMeta from "./PackageMeta";

jest.mock("^/components/ClientDate", () => ({
    __esModule: true,
    default: () => null,
}));

const renderMeta = (latest: Partial<CatalogLatestVersion>) =>
    render(
        <PackageMeta
            summary={{
                name: "example",
                versions: ["1.0.0"],
                latest: {
                    version: "1.0.0",
                    keywords: [],
                    maintainersCount: 0,
                    ...latest,
                },
            }}
        />,
    );

describe("PackageMeta", () => {
    it("shows a known repository host as an icon with owner/repo and directory", () => {
        renderMeta({
            repository: {
                host: "github",
                text: "babel/babel",
                directory: "packages/babel-core",
                href: "https://github.com/babel/babel/tree/HEAD/packages/babel-core",
            },
        });

        const link = screen.getByRole("link", { name: /babel\/babel/ });
        expect(link).toHaveTextContent("babel/babel/packages/babel-core");
        expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
        expect(link).toHaveAttribute(
            "href",
            "https://github.com/babel/babel/tree/HEAD/packages/babel-core",
        );
    });

    it("shows the homepage URL without https://", () => {
        renderMeta({
            homepage: { text: "example.com", href: "https://example.com/" },
        });

        expect(
            screen.getByRole("link", { name: "example.com" }),
        ).toHaveAttribute("href", "https://example.com/");
    });

    it("shows values without a valid URL as text, not links", () => {
        renderMeta({
            repository: { text: "git://git.example.com/owner/repo.git" },
            homepage: { text: "javascript:alert(1)" },
        });

        expect(
            screen.getByText("git://git.example.com/owner/repo.git"),
        ).toBeInTheDocument();
        expect(screen.getByText("javascript:alert(1)")).toBeInTheDocument();
        expect(screen.getAllByRole("link")).toHaveLength(1);
    });
});
