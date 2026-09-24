import {
    authorName,
    type CatalogPackument,
    licenseText,
    MAX_CATALOG_KEYWORDS,
    repositoryUrl,
    summarizePackument,
} from "./catalogSummary";

describe("licenseText", () => {
    it.each([
        [{ license: "MIT" }, "MIT"],
        [{ license: "(ISC OR GPL-3.0)" }, "(ISC OR GPL-3.0)"],
        [
            {
                license: {
                    type: "ISC",
                    url: "https://opensource.org/licenses/ISC",
                },
            },
            "ISC",
        ],
        [
            {
                licenses: [
                    { type: "MIT", url: "https://opensource.org/licenses/MIT" },
                    { type: "Apache-2.0" },
                ],
            },
            "MIT OR Apache-2.0",
        ],
        [{ license: "MIT", licenses: [{ type: "ISC" }] }, "MIT"],
        [{}, undefined],
    ])("%j → %p", (manifest, expected) => {
        expect(licenseText(manifest)).toBe(expected);
    });
});

describe("authorName", () => {
    it.each([
        [{ name: "Barney Rubble", email: "b@rubble.com" }, "Barney Rubble"],
        [
            "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)",
            "Barney Rubble",
        ],
        ["Barney Rubble (http://barnyrubble.tumblr.com/)", "Barney Rubble"],
        ["Barney Rubble", "Barney Rubble"],
        ["<b@rubble.com>", undefined],
        [undefined, undefined],
    ])("%j → %p", (author, expected) => {
        expect(authorName(author)).toBe(expected);
    });
});

describe("repositoryUrl", () => {
    it.each([
        [
            { type: "git", url: "git+https://github.com/npm/cli.git" },
            "https://github.com/npm/cli",
        ],
        [
            { type: "git", url: "git://github.com/npm/cli.git" },
            "https://github.com/npm/cli",
        ],
        [
            { type: "git", url: "git+ssh://git@github.com/npm/cli.git" },
            "https://github.com/npm/cli",
        ],
        ["npm/npm", "https://github.com/npm/npm"],
        ["github:user/repo", "https://github.com/user/repo"],
        ["gist:11081aaa281", "https://gist.github.com/11081aaa281"],
        ["bitbucket:user/repo", "https://bitbucket.org/user/repo"],
        ["gitlab:user/repo", "https://gitlab.com/user/repo"],
        [
            { url: "git+https://git.example.com/owner/repo.git" },
            "https://git.example.com/owner/repo",
        ],
    ])("%j → %p", (repository, expected) => {
        expect(repositoryUrl(repository)).toBe(expected);
    });

    it.each([
        { url: "git://git.example.com/owner/repo.git" },
        { url: "javascript:alert(1)" },
        { type: "git" },
        undefined,
    ])("has no link for %j", (repository) => {
        expect(repositoryUrl(repository)).toBeUndefined();
    });
});

describe("summarizePackument", () => {
    const packument: CatalogPackument = {
        name: "example",
        "dist-tags": { latest: "2.0.0" },
        time: {
            "1.0.0": "2020-01-01T00:00:00.000Z",
            "2.0.0": "2021-01-01T00:00:00.000Z",
        },
        versions: {
            "1.0.0": {},
            "2.0.0": {
                description: "An example",
                license: "MIT",
                author: "Jane Doe <jane@example.com>",
                repository: "github:owner/example",
                homepage: "https://example.com/",
                keywords: Array.from({ length: 20 }, (_, i) => `k${i}`),
                maintainers: [{ name: "a" }, { name: "b" }],
            },
        },
    };

    it("summarizes the latest version", () => {
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
                keywords: Array.from(
                    { length: MAX_CATALOG_KEYWORDS },
                    (_, i) => `k${i}`,
                ),
                maintainersCount: 2,
            },
        });
    });

    it("drops a non-http homepage", () => {
        const summary = summarizePackument({
            ...packument,
            versions: { "2.0.0": { homepage: "javascript:alert(1)" } },
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
});
