import buildVersionMap from "./buildVersionMap";

describe("buildVersionMap", () => {
    it("maps each version to its time", () => {
        expect(
            buildVersionMap({ "1.0.0": "2020-01-01T00:00:00.000Z" }, {}),
        ).toEqual({
            "1.0.0": { time: "2020-01-01T00:00:00.000Z" },
        });
    });

    it("attaches a single dist-tag to its version", () => {
        expect(
            buildVersionMap(
                { "1.0.0": "2020-01-01T00:00:00.000Z" },
                { latest: "1.0.0" },
            ),
        ).toEqual({
            "1.0.0": { time: "2020-01-01T00:00:00.000Z", tags: ["latest"] },
        });
    });

    it("attaches multiple dist-tags to the same version", () => {
        expect(
            buildVersionMap(
                { "1.0.0": "2020-01-01T00:00:00.000Z" },
                { latest: "1.0.0", stable: "1.0.0" },
            ),
        ).toEqual({
            "1.0.0": {
                time: "2020-01-01T00:00:00.000Z",
                tags: ["latest", "stable"],
            },
        });
    });

    it("ignores a dist-tag pointing at a version that isn't in the map", () => {
        expect(
            buildVersionMap(
                { "1.0.0": "2020-01-01T00:00:00.000Z" },
                { next: "2.0.0-beta.1" },
            ),
        ).toEqual({
            "1.0.0": { time: "2020-01-01T00:00:00.000Z" },
        });
    });

    it("returns an empty map for empty input", () => {
        expect(buildVersionMap({}, {})).toEqual({});
    });
});
