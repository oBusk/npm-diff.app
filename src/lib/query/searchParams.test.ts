import {
    fromSearchParams,
    toSearchParams,
    toSearchString,
} from "./searchParams";

describe("toSearchString", () => {
    it("returns an empty string for no params", () => {
        expect(toSearchString({})).toBe("");
        expect(toSearchString({ diffFiles: undefined })).toBe("");
    });

    it("encodes values", () => {
        const search = toSearchString({ diffFiles: "a&diffNameOnly=true#x" });

        expect(search).toBe("?diffFiles=a%26diffNameOnly%3Dtrue%23x");
        expect(Array.from(new URLSearchParams(search.slice(1)))).toStrictEqual([
            ["diffFiles", "a&diffNameOnly=true#x"],
        ]);
    });

    it("appends each value of arrays", () => {
        expect(toSearchString({ diffFiles: ["a,b", "c"], view: "split" })).toBe(
            "?diffFiles=a%2Cb&diffFiles=c&view=split",
        );
    });
});

describe("fromSearchParams", () => {
    it("keeps single values as strings and repeated values as arrays", () => {
        expect(
            fromSearchParams(
                new URLSearchParams("diffFiles=a&diffFiles=b&diffUnified=3"),
            ),
        ).toStrictEqual({ diffFiles: ["a", "b"], diffUnified: "3" });
    });

    it("round-trips with toSearchParams", () => {
        const input = new URLSearchParams(
            "diffFiles=a%26b&diffFiles=c&diffText=",
        );

        expect(toSearchParams(fromSearchParams(input)).toString()).toBe(
            input.toString(),
        );
    });
});
