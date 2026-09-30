import getPackageVersions from "^/lib/api/packageVersions";
import getCatalogSummary, {
    authorName,
    homepageLink,
    licenseText,
    repositoryLink,
} from "./catalogSummary";
import fetchLatestManifest from "./latestManifest";
import type { Manifest } from "./packument";

jest.mock("^/lib/api/packageVersions", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("./latestManifest", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const getPackageVersionsMock = getPackageVersions as jest.Mock;
const fetchLatestManifestMock = fetchLatestManifest as jest.Mock;

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

    it.each([
        { license: { type: { name: "MIT" } } },
        { license: [{ type: "MIT" }] },
        { licenses: { type: "MIT" } },
        { licenses: "MIT" },
        { licenses: [null, { type: 1 }] },
    ])("has no license for %j", (manifest) => {
        expect(licenseText(manifest as unknown as Manifest)).toBeUndefined();
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
        [{ name: { first: "Barney" } }, undefined],
        [undefined, undefined],
    ])("%j → %p", (author, expected) => {
        expect(authorName(author as Manifest["author"])).toBe(expected);
    });
});

describe("repositoryLink", () => {
    const github = (text: string, href: string, directory?: string) => ({
        host: "github",
        text,
        href,
        ...(directory && { directory }),
    });

    it.each([
        [
            { type: "git", url: "git+https://github.com/npm/cli.git" },
            github("npm/cli", "https://github.com/npm/cli"),
        ],
        [
            { type: "git", url: "git://github.com/npm/cli.git" },
            github("npm/cli", "https://github.com/npm/cli"),
        ],
        [
            { type: "git", url: "git+ssh://git@github.com/npm/cli.git" },
            github("npm/cli", "https://github.com/npm/cli"),
        ],
        ["npm/npm", github("npm/npm", "https://github.com/npm/npm")],
        [
            "github:user/repo",
            github("user/repo", "https://github.com/user/repo"),
        ],
        [
            "https://github.com/owner/repo#main",
            github("owner/repo", "https://github.com/owner/repo/tree/main"),
        ],
        [
            {
                type: "git",
                url: "https://github.com/babel/babel.git",
                directory: "packages/babel-core",
            },
            github(
                "babel/babel",
                "https://github.com/babel/babel/tree/HEAD/packages/babel-core",
                "packages/babel-core",
            ),
        ],
        [
            { url: "https://github.com/owner/repo.git", directory: "" },
            github("owner/repo", "https://github.com/owner/repo"),
        ],
        [
            {
                url: "https://gitlab.com/group/repo.git",
                directory: "packages/x",
            },
            {
                host: "gitlab",
                text: "group/repo",
                directory: "packages/x",
                href: "https://gitlab.com/group/repo/tree/HEAD/packages/x",
            },
        ],
        [
            "bitbucket:user/repo",
            {
                host: "bitbucket",
                text: "user/repo",
                href: "https://bitbucket.org/user/repo",
            },
        ],
        [
            "gist:11081aaa281",
            {
                host: "gist",
                text: "11081aaa281",
                href: "https://gist.github.com/11081aaa281",
            },
        ],
        [
            "https://git.sr.ht/~user/repo",
            {
                host: "sourcehut",
                text: "~user/repo",
                href: "https://git.sr.ht/~user/repo",
            },
        ],
    ])("%j → %j", (repository, expected) => {
        expect(repositoryLink(repository)).toEqual(expected);
    });

    it.each([
        "git+https://git.example.com/owner/repo.git",
        "https://git.example.com/owner/repo",
        "https://gitlab.com/owner/repo/-/tree/main/packages/core",
        "javascript:alert(1)",
        "not a repository",
        "  ",
    ])("has no repository for the unknown host %j", (url) => {
        expect(repositoryLink({ type: "git", url })).toBeUndefined();
    });

    it.each([
        { type: "git" },
        { url: { href: "https://github.com/npm/cli" } },
        undefined,
    ])("has no repository for %j", (repository) => {
        expect(
            repositoryLink(repository as Manifest["repository"]),
        ).toBeUndefined();
    });
});

describe("homepageLink", () => {
    it.each([
        [
            "https://example.com/docs",
            { text: "example.com/docs", href: "https://example.com/docs" },
        ],
        [
            "http://example.com/",
            { text: "http://example.com/", href: "http://example.com/" },
        ],
    ])("%j → %j", (homepage, expected) => {
        expect(homepageLink(homepage)).toEqual(expected);
    });

    it.each([
        undefined,
        "",
        "  ",
        ["https://example.com/"],
        "example.com",
        "javascript:alert(1)",
        "README.md",
    ])("has no homepage for %j", (homepage) => {
        expect(homepageLink(homepage as Manifest["homepage"])).toBeUndefined();
    });
});

describe("getCatalogSummary", () => {
    const versions = {
        "1.0.0": "2020-01-01T00:00:00.000Z",
        "2.0.0": "2021-01-01T00:00:00.000Z",
    };

    const summarize = (latestManifest: Partial<Manifest>) => {
        fetchLatestManifestMock.mockResolvedValue({
            version: "2.0.0",
            ...latestManifest,
        });
        getPackageVersionsMock.mockResolvedValue(versions);

        return getCatalogSummary("example");
    };

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it("summarizes the latest version", async () => {
        await expect(
            summarize({
                description: "An example",
                license: "MIT",
                author: "Jane Doe <jane@example.com>",
                repository: "github:owner/example",
                homepage: "https://example.com/",
                keywords: ["one", "two"],
                maintainers: [{ name: "a" }, { name: "b" }],
            }),
        ).resolves.toEqual({
            name: "example",
            versions: ["1.0.0", "2.0.0"],
            latest: {
                version: "2.0.0",
                time: "2021-01-01T00:00:00.000Z",
                description: "An example",
                license: "MIT",
                author: "Jane Doe",
                repository: {
                    host: "github",
                    text: "owner/example",
                    href: "https://github.com/owner/example",
                },
                homepage: {
                    text: "example.com",
                    href: "https://example.com/",
                },
                keywords: ["one", "two"],
                maintainersCount: 2,
            },
            cacheLife: "hours",
        });
        expect(getPackageVersionsMock).toHaveBeenCalledWith("example", "2.0.0");
    });

    it("drops fields that aren't strings", async () => {
        const summary = await summarize({
            description: { text: "An example" },
            homepage: ["https://example.com/"],
            keywords: ["one", { name: "two" }, 3, "one"],
            maintainers: { name: "a" },
        } as unknown as Partial<Manifest>);

        expect(summary.latest).toEqual({
            version: "2.0.0",
            time: "2021-01-01T00:00:00.000Z",
            keywords: ["one"],
            maintainersCount: 0,
        });
    });

    it("lists versions without a latest manifest", async () => {
        fetchLatestManifestMock.mockResolvedValue(null);
        getPackageVersionsMock.mockResolvedValue(versions);

        await expect(getCatalogSummary("example")).resolves.toEqual({
            name: "example",
            versions: ["1.0.0", "2.0.0"],
            cacheLife: "hours",
        });
        expect(getPackageVersionsMock).toHaveBeenCalledWith(
            "example",
            undefined,
        );
    });

    it("caches briefly when the latest manifest can't be fetched", async () => {
        fetchLatestManifestMock.mockRejectedValue(new Error("503"));
        getPackageVersionsMock.mockResolvedValue(versions);

        await expect(getCatalogSummary("example")).resolves.toEqual({
            name: "example",
            versions: ["1.0.0", "2.0.0"],
            cacheLife: "minutes",
        });
    });

    it("throws when the package has no versions", async () => {
        fetchLatestManifestMock.mockResolvedValue(null);
        getPackageVersionsMock.mockResolvedValue(null);

        await expect(getCatalogSummary("example")).rejects.toThrow(
            "Package not found: example",
        );
    });
});
