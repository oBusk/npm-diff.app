import parseNumber from "./parse-number";

describe("query/parseNumber", () => {
    it("input is `undefined`", () =>
        expect(parseNumber(undefined)).toBeUndefined());
    it(`input is ""`, () => expect(parseNumber("")).toBeUndefined());
    it(`input is []`, () => expect(parseNumber([])).toBeUndefined());

    it(`input is "1"`, () => expect(parseNumber("1")).toBe(1));
    it(`input is "999"`, () => expect(parseNumber("999")).toBe(999));
    it(`input is "123XXX"`, () => expect(parseNumber("123XXX")).toBe(123));

    it(`input is [1 ,2 ,3]`, () =>
        expect(parseNumber(["1", "2", "3"])).toBe(3));
});
