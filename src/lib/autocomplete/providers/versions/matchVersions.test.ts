import { Version } from "^/lib/middleware";
import { Matched, matchVersions } from "./matchVersions";

describe("matchVersions", () => {
    let size: number;
    let versions: Version[];
    let fn: (rawSpec: string) => Matched[];

    beforeEach(() => {
        size = 3;
        versions = [
            ...[
                "0.0.1",
                "0.0.2",
                "0.0.3",
                "1.0.0",
                "1.1.0",
                "1.2.1",
                "1.2.2",
                "1.2.3",
                "2.0.0",
                "10.0.0",
                "11.0.0",
                "11.0.1",
                "11.0.2",
                "11.0.3",
                "11.0.4",
                "11.0.5",
                "11.0.6",
                "11.0.7",
                "11.0.8",
                "11.0.9",
            ].map((version) => ({ version })),
            { version: "11.0.10", tags: ["latest"] },
        ];
        fn = (rawSpec: string) => matchVersions({ rawSpec, versions, size });
    });

    it("Does not mutate versions array parameter", () => {
        const original = [...versions];
        fn("1.0.0");
        expect(versions).toEqual(original);
    });

    it("Returns latest-tag + latest versions if no input", () =>
        expect(fn("")).toEqual([
            {
                version: "11.0.10",
                tags: ["latest"],
            },
            { version: "11.0.9" },
            { version: "11.0.8" },
        ]));

    it("Returns latest versions that starts with input", () => {
        expect(fn("la")).toEqual([
            { version: "11.0.10", tags: ["<em>la</em>test"] },
        ]);
        expect(fn("1")).toEqual([
            {
                version: "<em>1</em>1.0.10",
                tags: ["latest"],
            },
            { version: "<em>1</em>1.0.9" },
            { version: "<em>1</em>1.0.8" },
        ]);
        expect(fn("1.")).toEqual([
            { version: "<em>1.</em>2.3" },
            { version: "<em>1.</em>2.2" },
            { version: "<em>1.</em>2.1" },
        ]);
        expect(fn("1.1")).toEqual([{ version: "<em>1.1</em>.0" }]);
        expect(fn("2")).toEqual([{ version: "<em>2</em>.0.0" }]);
        expect(fn("0")).toEqual([
            { version: "<em>0</em>.0.3" },
            { version: "<em>0</em>.0.2" },
            { version: "<em>0</em>.0.1" },
        ]);
    });

    it("Returns empty array if there is no match", () => {
        expect(fn("99")).toEqual([]);
    });
});
