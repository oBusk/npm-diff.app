import { type Version } from "^/app/api/-/versions/types";
import { generateCatalogLinks } from "./generateCatalogLinks";

describe("generateCatalogLinks", () => {
    it("should generate patch, minor, and major links", () => {
        const versions: Version[] = [
            { version: "3.0.0", time: "2024-01-01" },
            { version: "2.2.0", time: "2023-12-01" },
            { version: "2.1.2", time: "2023-11-15" },
            { version: "2.1.1", time: "2023-11-10" },
            { version: "2.1.0", time: "2023-11-01" },
            { version: "2.0.0", time: "2023-10-01" },
            { version: "1.5.0", time: "2023-09-01" },
            { version: "1.4.1", time: "2023-08-15" },
            { version: "1.4.0", time: "2023-08-01" },
            { version: "1.3.0", time: "2023-07-01" },
        ];

        const links = generateCatalogLinks("test-package", versions);

        // Should have generated links
        expect(links.length).toBeGreaterThan(0);

        // Should have patch links
        const patchLinks = links.filter((l) => l.type === "patch");
        expect(patchLinks.length).toBeGreaterThan(0);

        // Should have minor links
        const minorLinks = links.filter((l) => l.type === "minor");
        expect(minorLinks.length).toBeGreaterThan(0);

        // Should have major links
        const majorLinks = links.filter((l) => l.type === "major");
        expect(majorLinks.length).toBeGreaterThan(0);
    });

    it("should generate patch links correctly", () => {
        const versions: Version[] = [
            { version: "1.0.3", time: "2024-01-03" },
            { version: "1.0.2", time: "2024-01-02" },
            { version: "1.0.1", time: "2024-01-01" },
        ];

        const links = generateCatalogLinks("pkg", versions);

        expect(links).toContainEqual({
            from: "pkg@1.0.2",
            to: "pkg@1.0.3",
            type: "patch",
            label: "1.0.2 → 1.0.3",
        });
        expect(links).toContainEqual({
            from: "pkg@1.0.1",
            to: "pkg@1.0.2",
            type: "patch",
            label: "1.0.1 → 1.0.2",
        });
    });

    it("should generate minor links correctly", () => {
        const versions: Version[] = [
            { version: "1.2.0", time: "2024-01-03" },
            { version: "1.1.0", time: "2024-01-02" },
            { version: "1.0.0", time: "2024-01-01" },
        ];

        const links = generateCatalogLinks("pkg", versions);

        expect(links).toContainEqual({
            from: "pkg@1.1.0",
            to: "pkg@1.2.0",
            type: "minor",
            label: "1.1.0 → 1.2.0",
        });
        expect(links).toContainEqual({
            from: "pkg@1.0.0",
            to: "pkg@1.1.0",
            type: "minor",
            label: "1.0.0 → 1.1.0",
        });
    });

    it("should generate major links correctly", () => {
        const versions: Version[] = [
            { version: "3.0.0", time: "2024-01-03" },
            { version: "2.0.0", time: "2024-01-02" },
            { version: "1.0.0", time: "2024-01-01" },
        ];

        const links = generateCatalogLinks("pkg", versions);

        expect(links).toContainEqual({
            from: "pkg@2.0.0",
            to: "pkg@3.0.0",
            type: "major",
            label: "2.0.0 → 3.0.0",
        });
        expect(links).toContainEqual({
            from: "pkg@1.0.0",
            to: "pkg@2.0.0",
            type: "major",
            label: "1.0.0 → 2.0.0",
        });
    });

    it("should filter out prerelease versions", () => {
        const versions: Version[] = [
            { version: "2.0.0-beta.1", time: "2024-01-03" },
            { version: "1.0.0", time: "2024-01-01" },
        ];

        const links = generateCatalogLinks("pkg", versions);

        // Should only create links from stable versions
        links.forEach((link) => {
            expect(link.from).not.toContain("-");
            expect(link.to).not.toContain("-");
        });
    });

    it("should handle packages with few versions", () => {
        const versions: Version[] = [{ version: "1.0.0", time: "2024-01-01" }];

        const links = generateCatalogLinks("pkg", versions);

        // Can't create diffs with only one version
        expect(links).toEqual([]);
    });

    it("should return empty array for only prerelease versions", () => {
        const versions: Version[] = [
            { version: "1.0.0-beta.2", time: "2024-01-02" },
            { version: "1.0.0-beta.1", time: "2024-01-01" },
        ];

        const links = generateCatalogLinks("pkg", versions);

        expect(links).toEqual([]);
    });
});
