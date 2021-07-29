import parseQuery from ".";

describe("query", () => {
    it("can parse a object with the supported options", () =>
        expect(
            parseQuery({
                diffFiles: "**/*.js",
                diffNameOnly: "true",
                diffUnified: "3",
                // diffIgnoreAllSpaces ommitted
                diffNoPrefix: "0",
                diffSrcPrefix: ["q/", "x/"],
                diffDstPrefix: "y/",
                diffText: "", // This is the result from `...&diffTexT&...`
            }),
        ).toStrictEqual({
            diffFiles: ["**/*.js"],
            diffNameOnly: true,
            diffUnified: 3,
            diffIgnoreAllSpace: undefined,
            diffNoPrefix: false,
            diffSrcPrefix: "x/",
            diffDstPrefix: "y/",
            diffText: true,
        }));
});
