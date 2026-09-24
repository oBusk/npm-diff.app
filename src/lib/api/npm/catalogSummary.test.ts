import {
    normalizeAuthor,
    normalizeKeywords,
    normalizeLicense,
    normalizeRepositoryUrl,
    summarizePackument,
} from "./catalogSummary";

describe("normalizeLicense", () => {
    it.each([
        ["MIT", "MIT"],
        [{ type: "ISC", url: "https://opensource.org/licenses/ISC" }, "ISC"],
        [[{ type: "MIT" }, { type: "Apache-2.0" }], "MIT OR Apache-2.0"],
        [["BSD-3-Clause", { type: "GPL-2.0" }], "BSD-3-Clause OR GPL-2.0"],
    ])("normalizes %p", (input, expected) => {
        expect(normalizeLicense(input)).toBe(expected);
    });

    it.each([undefined, null, "", 42, {}, { url: "x" }, []])(
        "returns undefined for %p",
        (input) => {
            expect(normalizeLicense(input)).toBeUndefined();
        },
    );
});

describe("normalizeAuthor", () => {
    it("keeps string authors", () => {
        expect(normalizeAuthor("Jane Doe <jane@example.com>")).toBe(
            "Jane Doe <jane@example.com>",
        );
    });

    it("uses the name of object authors", () => {
        expect(
            normalizeAuthor({ name: "Jane Doe", email: "jane@example.com" }),
        ).toBe("Jane Doe");
    });

    it.each([undefined, null, "", { email: "jane@example.com" }, 42, []])(
        "returns undefined for %p",
        (input) => {
            expect(normalizeAuthor(input)).toBeUndefined();
        },
    );
});

describe("normalizeKeywords", () => {
    it("keeps array keywords", () => {
        expect(normalizeKeywords(["a", "b"])).toEqual(["a", "b"]);
    });

    it("splits string keywords", () => {
        expect(normalizeKeywords("a, b c,d")).toEqual(["a", "b", "c", "d"]);
    });

    it("drops non-string, empty and duplicate keywords", () => {
        expect(normalizeKeywords(["a", 1, null, "", " ", "a", "b"])).toEqual([
            "a",
            "b",
        ]);
    });

    it("limits to 10 keywords", () => {
        const keywords = Array.from({ length: 20 }, (_, i) => `k${i}`);
        expect(normalizeKeywords(keywords)).toEqual(keywords.slice(0, 10));
    });

    it.each([undefined, null, 42, {}])("returns [] for %p", (input) => {
        expect(normalizeKeywords(input)).toEqual([]);
    });
});

describe("normalizeRepositoryUrl", () => {
    it.each([
        [
            { type: "git", url: "git+https://github.com/owner/repo.git" },
            "https://github.com/owner/repo",
        ],
        ["https://github.com/owner/repo", "https://github.com/owner/repo"],
        ["https://github.com/owner/repo.git", "https://github.com/owner/repo"],
    ])("normalizes %p", (input, expected) => {
        expect(normalizeRepositoryUrl(input)).toBe(expected);
    });

    it.each([
        "github:owner/repo",
        "owner/repo",
        { url: "git://github.com/owner/repo.git" },
        { url: "git+ssh://git@github.com/owner/repo.git" },
        { url: "javascript:alert(1)" },
        { type: "git" },
        undefined,
    ])("returns undefined for %p", (input) => {
        expect(normalizeRepositoryUrl(input)).toBeUndefined();
    });
});

describe("summarizePackument", () => {
    const packument = {
        name: "example",
        "dist-tags": { latest: "2.0.0" },
        time: {
            created: "2020-01-01T00:00:00.000Z",
            "1.0.0": "2020-01-01T00:00:00.000Z",
            "2.0.0": "2021-01-01T00:00:00.000Z",
        },
        readme: "x".repeat(10_000),
        versions: {
            "1.0.0": { name: "example", version: "1.0.0" },
            "2.0.0": {
                name: "example",
                version: "2.0.0",
                description: "An example",
                license: { type: "MIT", url: "https://example.com/license" },
                author: { name: "Jane Doe" },
                repository: {
                    type: "git",
                    url: "git+https://github.com/owner/example.git",
                },
                homepage: "https://example.com/",
                keywords: "one, two",
                maintainers: [{ name: "a" }, { name: "b" }],
                dependencies: { foo: "^1.0.0" },
            },
        },
    };

    it("returns only the trimmed summary", () => {
        expect(summarizePackument(packument)).toEqual({
            name: "example",
            versions: ["1.0.0", "2.0.0"],
            latest: {
                version: "2.0.0",
                time: "2021-01-01T00:00:00.000Z",
                description: "An example",
                license: "MIT",
                author: "Jane Doe",
                repositoryUrl: "https://github.com/owner/example",
                homepageUrl: "https://example.com/",
                keywords: ["one", "two"],
                maintainersCount: 2,
            },
        });
    });

    it("drops non-http homepage", () => {
        const summary = summarizePackument({
            ...packument,
            versions: {
                "2.0.0": {
                    ...packument.versions["2.0.0"],
                    homepage: "javascript:alert(1)",
                },
            },
        });
        expect(summary.latest?.homepageUrl).toBeUndefined();
    });

    it("omits latest when the latest manifest is missing", () => {
        expect(
            summarizePackument({
                name: "example",
                "dist-tags": { latest: "3.0.0" },
                versions: { "1.0.0": {} },
            }),
        ).toEqual({ name: "example", versions: ["1.0.0"] });
    });

    it("handles missing dist-tags, time and versions", () => {
        expect(summarizePackument({ name: "example" })).toEqual({
            name: "example",
            versions: [],
        });
    });

    it("throws on invalid input", () => {
        expect(() => summarizePackument(null)).toThrow();
        expect(() => summarizePackument({})).toThrow();
    });
});
