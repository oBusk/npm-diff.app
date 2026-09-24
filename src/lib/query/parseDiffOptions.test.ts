import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import parseDiffOptions from "./parseDiffOptions";

describe("parseDiffOptions", () => {
    it("accepts valid options", () => {
        expect(
            parseDiffOptions({
                diffFiles: ["{lib,dist}/**", "*.md"],
                diffUnified: "3",
                diffSrcPrefix: "a/",
                diffDstPrefix: "b/",
            }),
        ).toStrictEqual({
            ok: true,
            options: {
                diffFiles: ["{lib,dist}/**", "*.md"],
                diffUnified: 3,
                diffSrcPrefix: "a/",
                diffDstPrefix: "b/",
            },
        });
    });

    it("accepts empty options", () => {
        expect(parseDiffOptions({})).toStrictEqual({ ok: true, options: {} });
    });

    it("accepts the default diffFiles glob", () => {
        expect(
            parseDiffOptions({ diffFiles: DEFAULT_DIFF_FILES_GLOB }).ok,
        ).toBe(true);
    });

    describe("diffFiles", () => {
        it("rejects an exponential brace pattern quickly", () => {
            const start = Date.now();
            const result = parseDiffOptions({
                diffFiles: "{a,b}".repeat(17),
            });

            expect(result.ok).toBe(false);
            expect(Date.now() - start).toBeLessThan(500);
        });

        it("rejects a large numeric brace range", () => {
            expect(parseDiffOptions({ diffFiles: "{1..100000}" }).ok).toBe(
                false,
            );
        });

        it("accepts a pattern expanding to exactly 64 alternatives", () => {
            expect(parseDiffOptions({ diffFiles: "{a,b}".repeat(6) }).ok).toBe(
                true,
            );
        });

        it("rejects a pattern expanding to 128 alternatives", () => {
            expect(parseDiffOptions({ diffFiles: "{a,b}".repeat(7) }).ok).toBe(
                false,
            );
        });

        it("accepts 10 patterns and rejects 11", () => {
            expect(
                parseDiffOptions({ diffFiles: Array(10).fill("*.js") }).ok,
            ).toBe(true);
            expect(
                parseDiffOptions({ diffFiles: Array(11).fill("*.js") }).ok,
            ).toBe(false);
        });

        it("accepts 256 character patterns and rejects longer", () => {
            expect(parseDiffOptions({ diffFiles: "a".repeat(256) }).ok).toBe(
                true,
            );
            expect(parseDiffOptions({ diffFiles: "a".repeat(257) }).ok).toBe(
                false,
            );
        });
    });

    describe("diffUnified", () => {
        it.each(["0", "3", "100"])("accepts %p", (value) => {
            expect(parseDiffOptions({ diffUnified: value })).toStrictEqual({
                ok: true,
                options: { diffUnified: Number(value) },
            });
        });

        it.each(["-5", "101", "abc", "1.5", "3abc"])("rejects %p", (value) => {
            expect(parseDiffOptions({ diffUnified: value }).ok).toBe(false);
        });
    });

    describe("prefixes", () => {
        it("accepts 64 characters and rejects longer", () => {
            expect(parseDiffOptions({ diffSrcPrefix: "a".repeat(64) }).ok).toBe(
                true,
            );
            expect(parseDiffOptions({ diffSrcPrefix: "a".repeat(65) }).ok).toBe(
                false,
            );
            expect(parseDiffOptions({ diffDstPrefix: "a".repeat(65) }).ok).toBe(
                false,
            );
        });
    });
});
