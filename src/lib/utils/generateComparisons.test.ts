import semver from "semver";
import { generateComparisons } from "./generateComparisons";

describe("generateComparisons", () => {
    it("returns empty array for package with 0 versions", () => {
        const result = generateComparisons([]);
        expect(result).toEqual([]);
    });

    it("returns empty array for package with 1 version", () => {
        const versions = ["1.0.0"];
        const result = generateComparisons(versions);
        expect(result).toEqual([]);
    });

    it("generates exactly 10 comparisons for a package with many versions", () => {
        const versions = [
            "1.0.0",
            "1.0.1",
            "1.1.0",
            "1.1.1",
            "2.0.0",
            "2.0.1",
            "2.1.0",
            "2.1.1",
            "3.0.0",
            "3.0.1",
            "3.1.0",
            "3.1.1",
            "3.1.2",
            "3.1.3",
            "3.1.4",
            "3.1.5",
        ];

        const result = generateComparisons(versions);
        expect(result).toHaveLength(10);
    });

    it("identifies major bumps correctly", () => {
        const versions = ["1.0.0", "1.9.4", "2.0.0", "2.5.0", "3.0.0", "3.1.0"];

        const result = generateComparisons(versions);

        // Should include major bumps: 3.0.0 vs 2.5.0, 2.0.0 vs 1.9.4
        const majorBumps = result.filter((c) => c.type === "major");
        expect(majorBumps.length).toBeGreaterThan(0);
        expect(majorBumps).toContainEqual({
            from: "2.5.0",
            to: "3.0.0",
            type: "major",
        });
        expect(majorBumps).toContainEqual({
            from: "1.9.4",
            to: "2.0.0",
            type: "major",
        });
    });

    it("identifies minor bumps correctly", () => {
        const versions = ["2.0.0", "2.0.12", "2.1.0", "2.1.3", "2.2.0"];

        const result = generateComparisons(versions);

        const minorBumps = result.filter((c) => c.type === "minor");
        expect(minorBumps.length).toBeGreaterThan(0);
        expect(minorBumps).toContainEqual({
            from: "2.1.3",
            to: "2.2.0",
            type: "minor",
        });
        expect(minorBumps).toContainEqual({
            from: "2.0.12",
            to: "2.1.0",
            type: "minor",
        });
    });

    it("identifies patch bumps correctly", () => {
        const versions = ["2.1.3", "2.1.4", "2.1.5", "2.1.6"];

        const result = generateComparisons(versions);

        const patchBumps = result.filter((c) => c.type === "patch");
        expect(patchBumps.length).toBeGreaterThan(0);
        expect(patchBumps).toContainEqual({
            from: "2.1.5",
            to: "2.1.6",
            type: "patch",
        });
    });

    it("returns fewer than 10 comparisons for packages with few versions", () => {
        const versions = ["1.0.0", "1.0.1", "1.0.2"];

        const result = generateComparisons(versions);
        expect(result.length).toBeLessThanOrEqual(2);
    });

    it("backfills from majors when not enough minor/patch bumps", () => {
        const versions = [
            "1.0.0",
            "2.0.0",
            "3.0.0",
            "4.0.0",
            "5.0.0",
            "6.0.0",
            "7.0.0",
            "8.0.0",
            "9.0.0",
            "10.0.0",
            "11.0.0",
        ];

        const result = generateComparisons(versions);

        // Should have 10 major bumps (since there are no minor/patch bumps)
        expect(result).toHaveLength(10);
        const majorBumps = result.filter((c) => c.type === "major");
        expect(majorBumps).toHaveLength(10);
    });

    it("sorts comparisons by semver version (newest first)", () => {
        const versions = ["1.0.0", "1.0.1", "2.0.0", "2.0.1"];

        const result = generateComparisons(versions);

        // Should be sorted by semver version (newest first), not by publish date
        for (let i = 0; i < result.length - 1; i++) {
            const versionA = result[i].to;
            const versionB = result[i + 1].to;
            // versionA should be greater than or equal to versionB (semver compare)
            expect(
                semver.gte(versionA, versionB) || versionA === versionB,
            ).toBe(true);
        }
    });

    it("filters out prerelease versions", () => {
        const versions = [
            "1.0.0",
            "1.0.1",
            "2.0.0-beta.1",
            "2.0.0-rc.1",
            "2.0.0",
            "2.0.1",
        ];

        const result = generateComparisons(versions);

        // Should not include any prerelease versions in comparisons
        expect(result.length).toBeGreaterThan(0);
        result.forEach((comparison) => {
            expect(comparison.from).not.toMatch(/-/);
            expect(comparison.to).not.toMatch(/-/);
        });
    });

    it("does not create patch comparisons for versions with same major.minor.patch but different prerelease", () => {
        const versions = [
            "19.3.0-canary-f93b9fd4-20251217",
            "19.3.0-canary-f6a48828-20251019",
            "19.3.0-canary-fb2177c1-20251114",
            "19.2.4",
            "19.2.3",
        ];

        const result = generateComparisons(versions);

        // Should not include any patch comparisons between 19.3.0-canary versions
        // since they all have the same major.minor.patch
        const patchBumps = result.filter((c) => c.type === "patch");
        const invalidPatches = patchBumps.filter(
            (c) =>
                (c.from.startsWith("19.3.0-canary") &&
                    c.to.startsWith("19.3.0-canary")) ||
                (c.from.includes("-canary") && c.to.includes("-canary")),
        );

        expect(invalidPatches).toHaveLength(0);
    });
});
