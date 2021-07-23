import parseString from "./parse-string";

describe("query/parseString", () => {
    it("input is undefiend", () =>
        expect(parseString(undefined)).toBeUndefined());
    it("input is []", () => expect(parseString([])).toBeUndefined());

    it(`input is ""`, () => expect(parseString("")).toBe(""));
    it(`input is "abc"`, () => expect(parseString("abc")).toBe("abc"));

    it(`input is array of ["a", "b"]`, () =>
        expect(parseString(["a", "b"])).toBe("b"));
});
