import buildVersions from "./buildVersions";

describe("buildVersions", () => {
    it("maps each version to its time", () => {
        expect(
            buildVersions({ "1.0.0": "2020-01-01T00:00:00.000Z" }, {}),
        ).toEqual([{ version: "1.0.0", time: "2020-01-01T00:00:00.000Z" }]);
    });

    it("attaches a single dist-tag to its version", () => {
        expect(
            buildVersions(
                { "1.0.0": "2020-01-01T00:00:00.000Z" },
                { latest: "1.0.0" },
            ),
        ).toEqual([
            {
                version: "1.0.0",
                time: "2020-01-01T00:00:00.000Z",
                tags: ["latest"],
            },
        ]);
    });

    it("attaches multiple dist-tags to the same version", () => {
        expect(
            buildVersions(
                { "1.0.0": "2020-01-01T00:00:00.000Z" },
                { latest: "1.0.0", stable: "1.0.0" },
            ),
        ).toEqual([
            {
                version: "1.0.0",
                time: "2020-01-01T00:00:00.000Z",
                tags: ["latest", "stable"],
            },
        ]);
    });

    it("ignores a dist-tag pointing at a version not in the times", () => {
        expect(
            buildVersions(
                { "1.0.0": "2020-01-01T00:00:00.000Z" },
                { next: "2.0.0-beta.1" },
            ),
        ).toEqual([{ version: "1.0.0", time: "2020-01-01T00:00:00.000Z" }]);
    });

    it("returns an empty array for empty input", () => {
        expect(buildVersions({}, {})).toEqual([]);
    });
});
