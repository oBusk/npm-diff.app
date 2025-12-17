import splitParts from "./splitParts";

describe("splitParts", () => {
    it("Should fail when input is incorrect type", () => {
        // No input
        expect(() => splitParts()).toThrow(/Invalid query/i);

        // Number input
        expect(() =>
            splitParts(
                // @ts-expect-error - Testing invalid number input
                1,
            ),
        ).toThrow(/Invalid query/i);

        // Number array input
        expect(() =>
            splitParts(
                // @ts-expect-error - Testing invalid number array input
                [1, 2, 3],
            ),
        ).toThrow(/Invalid query/i);

        // Object input
        expect(() =>
            splitParts(
                // @ts-expect-error - Testing invalid object input
                {},
            ),
        ).toThrow(/Invalid query/i);
    });

    describe("Single spec", () => {
        it("Handles single un-scoped spec", () => {
            expect(splitParts("package")).toEqual(["package"]);
        });

        it("Handles single scoped spec", () => {
            expect(splitParts("@types/package")).toEqual(["@types/package"]);
        });
    });

    describe("Two specs", () => {
        it("Handles default usecase (two specs)", () => {
            expect(splitParts("package@1.0.0...package@2.0.0")).toEqual([
                "package@1.0.0",
                "package@2.0.0",
            ]);
        });

        it("Handles two scoped specs", () => {
            expect(
                splitParts("@types/package@^1...@types/package@^2".split("/")),
            ).toEqual(["@types/package@^1", "@types/package@^2"]);
        });

        it("Handles one unscoped and one scoped", () => {
            expect(
                splitParts("package@^1...@types/package@^2".split("/")),
            ).toEqual(["package@^1", "@types/package@^2"]);
        });

        it("Throws on double-scoped packages", () => {
            expect(() =>
                splitParts(
                    "@types/types/package@^1...@types/package@^2".split("/"),
                ),
            ).toThrow(/Invalid query/i);
        });
    });

    it("Throws on more than 2 specs", () => {
        expect(() =>
            splitParts("package@^1...package@^2...package@^3"),
        ).toThrow(/Invalid query/i);
    });
});
