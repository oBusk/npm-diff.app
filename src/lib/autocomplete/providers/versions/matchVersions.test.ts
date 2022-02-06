import exp from "constants";
import { Version } from "^/lib/middleware";
import { Matched, matchVersions } from "./matchVersions";

describe("matchVersions", () => {
    let size: number;
    let versions: Version[];
    let fn: (rawSpec: string, minVersion?: string) => Matched[];

    beforeEach(() => {
        size = 4;
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
                "11.1.0",
                "11.1.1",
                "11.1.2",
            ].map((version) => ({ version })),
            { version: "11.2.0", tags: ["latest"] },
        ];
        fn = (rawSpec: string, minVersion) =>
            matchVersions({ rawSpec, versions, size, minVersion });
    });

    it("Does not mutate versions array parameter", () => {
        const original = [...versions];
        fn("1.0.0");
        // Equal but not the same instance
        expect(versions).not.toBe(original);
        expect(versions).toEqual(original);
    });

    it("Empty Input. (latest, previous patch, previous minor, previous major)", () =>
        expect(fn("")).toEqual<Matched[]>([
            {
                version: "11.2.0",
                versionEmphasized: "11.2.0",
                tags: ["latest"],
            },
            // previous patch
            { version: "11.1.2", versionEmphasized: "11.1.2" },
            // Previous minor (from the previous patch)
            { version: "11.0.4", versionEmphasized: "11.0.4" },
            // // Previous major (from the previous minor)
            { version: "10.0.0", versionEmphasized: "10.0.0" },
        ]));

    describe("Version matching", () => {
        it("Input: 1", () =>
            expect(fn("1")).toEqual<Matched[]>([
                {
                    version: "11.2.0",
                    versionEmphasized: "<em>1</em>1.2.0",
                    tags: ["latest"],
                },
                // previous patch
                { version: "11.1.2", versionEmphasized: "<em>1</em>1.1.2" },
                // Previous minor (from the previous patch)
                { version: "11.0.4", versionEmphasized: "<em>1</em>1.0.4" },
                // // Previous major (from the previous minor)
                { version: "10.0.0", versionEmphasized: "<em>1</em>0.0.0" },
            ]));

        it("Input: 11", () =>
            expect(fn("11")).toEqual<Matched[]>([
                {
                    version: "11.2.0",
                    versionEmphasized: "<em>11</em>.2.0",
                    tags: ["latest"],
                },
                // previous patch
                { version: "11.1.2", versionEmphasized: "<em>11</em>.1.2" },
                // Filler to get to size
                { version: "11.1.1", versionEmphasized: "<em>11</em>.1.1" },
                // Previous minor (from the previous patch)
                { version: "11.0.4", versionEmphasized: "<em>11</em>.0.4" },
            ]));

        it("Input: 11.", () =>
            expect(fn("11.")).toEqual<Matched[]>([
                {
                    version: "11.2.0",
                    versionEmphasized: "<em>11.</em>2.0",
                    tags: ["latest"],
                },
                // previous patch
                { version: "11.1.2", versionEmphasized: "<em>11.</em>1.2" },
                // Filler to get to size
                { version: "11.1.1", versionEmphasized: "<em>11.</em>1.1" },
                // Previous minor (from the previous patch)
                { version: "11.0.4", versionEmphasized: "<em>11.</em>0.4" },
            ]));

        it("Input: 11.1", () =>
            expect(fn("11.1")).toEqual<Matched[]>([
                { version: "11.1.2", versionEmphasized: "<em>11.1</em>.2" },
                { version: "11.1.1", versionEmphasized: "<em>11.1</em>.1" },
                { version: "11.1.0", versionEmphasized: "<em>11.1</em>.0" },
            ]));

        it("Input: 11.1.", () =>
            expect(fn("11.1.")).toEqual<Matched[]>([
                { version: "11.1.2", versionEmphasized: "<em>11.1.</em>2" },
                { version: "11.1.1", versionEmphasized: "<em>11.1.</em>1" },
                { version: "11.1.0", versionEmphasized: "<em>11.1.</em>0" },
            ]));

        it("Input: 11.1.1", () =>
            expect(fn("11.1.1")).toEqual<Matched[]>([
                { version: "11.1.1", versionEmphasized: "<em>11.1.1</em>" },
            ]));
    });

    describe("Match tags", () => {
        it("Input: la", () =>
            expect(fn("la")).toEqual<Matched[]>([
                {
                    version: "11.2.0",
                    versionEmphasized: "11.2.0",
                    tags: ["<em>la</em>test"],
                },
            ]));

        it("Input: late", () =>
            expect(fn("late")).toEqual<Matched[]>([
                {
                    version: "11.2.0",
                    versionEmphasized: "11.2.0",
                    tags: ["<em>late</em>st"],
                },
            ]));
    });

    describe("Min version", () => {
        describe("Input: ''", () => {
            it("minVersion: '2.0.0'", () =>
                expect(fn("", "2.0.0")).toEqual<Matched[]>([
                    {
                        tags: ["latest"],
                        version: "11.2.0",
                        versionEmphasized: "11.2.0",
                    },
                    {
                        version: "11.1.2",
                        versionEmphasized: "11.1.2",
                    },
                    {
                        version: "11.0.4",
                        versionEmphasized: "11.0.4",
                    },
                    {
                        version: "10.0.0",
                        versionEmphasized: "10.0.0",
                    },
                ]));

            it("minVersion: '11.1.1'", () =>
                expect(fn("", "11.1.1")).toEqual<Matched[]>([
                    {
                        tags: ["latest"],
                        version: "11.2.0",
                        versionEmphasized: "11.2.0",
                    },
                    {
                        version: "11.1.2",
                        versionEmphasized: "11.1.2",
                    },
                ]));
        });

        describe("Input: '1.'", () => {
            it("minVersion: '2.0.0' (Should match nothing)", () =>
                expect(fn("1.", "2.0.0")).toEqual<Matched[]>([]));

            it("minVersion: '1.1.0'", () =>
                expect(fn("1.", "1.1.0")).toEqual<Matched[]>([
                    { version: "1.2.3", versionEmphasized: "<em>1.</em>2.3" },
                    { version: "1.2.2", versionEmphasized: "<em>1.</em>2.2" },
                    { version: "1.2.1", versionEmphasized: "<em>1.</em>2.1" },
                ]));
        });
    });

    it("Input: 99 (no matches)", () => expect(fn("99")).toEqual<Matched[]>([]));
});
