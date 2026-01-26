import { generateComparisons } from "./generateComparisons";

describe("generateComparisons", () => {
    it("returns empty array for package with 0 versions", () => {
        const result = generateComparisons([], {});
        expect(result).toEqual([]);
    });

    it("returns empty array for package with 1 version", () => {
        const versions = ["1.0.0"];
        const versionMap = { "1.0.0": { time: "2020-01-01" } };
        const result = generateComparisons(versions, versionMap);
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
        const versionMap: Record<string, { time: string }> = {};
        versions.forEach((v, i) => {
            versionMap[v] = { time: `2020-01-${String(i + 1).padStart(2, "0")}` };
        });

        const result = generateComparisons(versions, versionMap);
        expect(result).toHaveLength(10);
    });

    it("identifies major bumps correctly", () => {
        const versions = [
            "1.0.0",
            "1.9.4",
            "2.0.0",
            "2.5.0",
            "3.0.0",
            "3.1.0",
        ];
        const versionMap: Record<string, { time: string }> = {
            "1.0.0": { time: "2020-01-01" },
            "1.9.4": { time: "2020-06-01" },
            "2.0.0": { time: "2020-07-01" },
            "2.5.0": { time: "2020-12-01" },
            "3.0.0": { time: "2021-01-01" },
            "3.1.0": { time: "2021-02-01" },
        };

        const result = generateComparisons(versions, versionMap);

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
        const versionMap: Record<string, { time: string }> = {
            "2.0.0": { time: "2020-01-01" },
            "2.0.12": { time: "2020-06-01" },
            "2.1.0": { time: "2020-07-01" },
            "2.1.3": { time: "2020-12-01" },
            "2.2.0": { time: "2021-01-01" },
        };

        const result = generateComparisons(versions, versionMap);

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
        const versionMap: Record<string, { time: string }> = {
            "2.1.3": { time: "2020-01-01" },
            "2.1.4": { time: "2020-02-01" },
            "2.1.5": { time: "2020-03-01" },
            "2.1.6": { time: "2020-04-01" },
        };

        const result = generateComparisons(versions, versionMap);

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
        const versionMap: Record<string, { time: string }> = {
            "1.0.0": { time: "2020-01-01" },
            "1.0.1": { time: "2020-02-01" },
            "1.0.2": { time: "2020-03-01" },
        };

        const result = generateComparisons(versions, versionMap);
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
        const versionMap: Record<string, { time: string }> = {};
        versions.forEach((v, i) => {
            versionMap[v] = { time: `2020-${String(i + 1).padStart(2, "0")}-01` };
        });

        const result = generateComparisons(versions, versionMap);

        // Should have 10 major bumps (since there are no minor/patch bumps)
        expect(result).toHaveLength(10);
        const majorBumps = result.filter((c) => c.type === "major");
        expect(majorBumps.length).toBe(10);
    });

    it("sorts comparisons by publish date (newest first)", () => {
        const versions = ["1.0.0", "1.0.1", "2.0.0", "2.0.1"];
        const versionMap: Record<string, { time: string }> = {
            "1.0.0": { time: "2020-01-01" },
            "1.0.1": { time: "2020-02-01" },
            "2.0.0": { time: "2020-03-01" },
            "2.0.1": { time: "2020-04-01" },
        };

        const result = generateComparisons(versions, versionMap);

        // Should be sorted by the "to" version's publish date, newest first
        for (let i = 0; i < result.length - 1; i++) {
            const timeA = versionMap[result[i].to].time;
            const timeB = versionMap[result[i + 1].to].time;
            expect(timeA >= timeB).toBe(true);
        }
    });

    it("handles versions with prerelease tags", () => {
        const versions = [
            "1.0.0",
            "1.0.1",
            "2.0.0-beta.1",
            "2.0.0",
            "2.0.1",
        ];
        const versionMap: Record<string, { time: string }> = {};
        versions.forEach((v, i) => {
            versionMap[v] = { time: `2020-01-${String(i + 1).padStart(2, "0")}` };
        });

        const result = generateComparisons(versions, versionMap);

        // Should include all valid semver versions, including prereleases
        expect(result.length).toBeGreaterThan(0);
        result.forEach((comparison) => {
            expect(comparison.from).toBeTruthy();
            expect(comparison.to).toBeTruthy();
        });
    });
});
