import parseParts from "./parseParts";

describe("parseParts", () => {
    it("parses two specs", () => {
        expect(parseParts("semver@7.6.0...semver@7.6.3")).toEqual([
            "semver@7.6.0",
            "semver@7.6.3",
        ]);
    });

    it("parses scoped specs from segments", () => {
        expect(parseParts(["@types", "react@17...@types", "react@18"])).toEqual(
            ["@types/react@17", "@types/react@18"],
        );
    });

    it("parses a spec and a version", () => {
        expect(parseParts("semver@7.6.0...7.6.3")).toEqual([
            "semver@7.6.0",
            "7.6.3",
        ]);
    });

    it("parses a single package name", () => {
        expect(parseParts("semver")).toEqual(["semver"]);
    });

    it("decodes parts when asked", () => {
        expect(
            parseParts("semver%407.6.0...semver%407.6.3", { decode: true }),
        ).toEqual(["semver@7.6.0", "semver@7.6.3"]);
    });

    it.each([
        ["too many separators", "a...b...c"],
        ["only a version", "1.0.0"],
        ["only versions", "1.0.0...2.0.0"],
        ["invalid package name", "NOT VALID@1"],
        ["unsupported spec type", "file:../foo...semver@1"],
    ])("returns null for %s", (_, parts) => {
        expect(parseParts(parts)).toBeNull();
    });

    it("returns null for malformed percent-encoding", () => {
        expect(parseParts("%E0%A4%A", { decode: true })).toBeNull();
    });

    it("returns null for too many segments", () => {
        expect(parseParts(["a", "b", "c", "d"])).toBeNull();
    });
});
