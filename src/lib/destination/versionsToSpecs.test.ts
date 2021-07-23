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

    it("Throw on two version-only inputs", () => {
        expect(() => vts(["1.0.0", "2.0.0"] as const)).toThrow();
    });
});
