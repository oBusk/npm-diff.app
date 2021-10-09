import parseBoolean from "./parseBoolean";

describe("query/parseBoolean", () => {
    it("input is `undefined`", () =>
        expect(parseBoolean(undefined)).toBeUndefined());
    it(`input is []`, () => expect(parseBoolean([])).toBeUndefined());

    it(`input is "0"`, () => expect(parseBoolean("0")).toBe(false));
    it(`input is "000"`, () => expect(parseBoolean("0")).toBe(false));
    it(`input is "0true"`, () => expect(parseBoolean("0")).toBe(false));
    it(`input is "no"`, () => expect(parseBoolean("0")).toBe(false));

    it(`input is "yes"`, () => expect(parseBoolean("yes")).toBe(true));
    it(`input is "true"`, () => expect(parseBoolean("true")).toBe(true));
    it(`input is "1"`, () => expect(parseBoolean("1")).toBe(true));
    it(`input is "1000"`, () => expect(parseBoolean("1000")).toBe(true));
    it(`input is ""`, () => expect(parseBoolean("")).toBe(true));

    it(`input is ["yes", "no"]`, () =>
        expect(parseBoolean(["yes", "no"])).toBe(false));
});
