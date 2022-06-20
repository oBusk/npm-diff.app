import vts from "./versionsToSpecs";

describe("versionsToSpecs", () => {
    const expected = Object.freeze(["example@1.0.0", "example@2.0.0"] as const);

    it("Returns specs when passing two specs", () => {
        expect(vts(expected)).toEqual(expected);
    });

    it("A as spec, B as version", () => {
        const specs = ["example@1.0.0", "2.0.0"] as const;
        expect(vts(specs)).toEqual(expected);
    });

    it("A as version, B as spec", () => {
        const specs = ["1.0.0", "example@2.0.0"] as const;
        expect(vts(specs)).toEqual(expected);
    });

    it("A as semver, B as spec", () => {
        const specAndVersion = ["^1.0.0", "example@2.0.0"] as const;
        const expected = ["example@^1.0.0", "example@2.0.0"] as const;
        expect(vts(specAndVersion)).toEqual(expected);
    });

    it("A as X syntax, B as spec", () => {
        const specAndVersion = ["1.X", "example@2.0.0"] as const;
        const expected = ["example@1.X", "example@2.0.0"] as const;
        expect(vts(specAndVersion)).toEqual(expected);
    });

    it("A as spec (get B from A)", () => {
        const specs = ["example@1.0.0"] as const;
        const expected = ["example@1.0.0", "example@latest"] as const;
        expect(vts(specs)).toEqual(expected);
    });

    it("A as X syntax (get B from A)", () => {
        const specs = ["example@1.X"] as const;
        const expected = ["example@1.X", "example@latest"] as const;
        expect(vts(specs)).toEqual(expected);
    });

    it("Throws on single version-only input", () => {
        const specs = ["1.0.0"] as const;
        expect(() => vts(specs)).toThrow(/package name/i);
    });

    it("Throws on single X syntax input", () => {
        const specs = ["1.X"] as const;
        expect(() => vts(specs)).toThrow(/package name/i);
    });

    it("Throw on two version-only inputs", () => {
        expect(() => vts(["1.0.0", "2.0.0"] as const)).toThrow();
    });
});
