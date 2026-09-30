import getPackageVersions from "^/lib/api/packageVersions/packageVersions";
import getCatalogSummary, {
    authorName,
    type CatalogSource,
    createCatalogSummary,
    homepageLink,
    licenseText,
    repositoryLink,
} from "./catalogSummary";
import fetchLatestManifest from "./latestManifest";
import type { Manifest } from "./packument";

jest.mock("^/lib/api/packageVersions/packageVersions", () => ({
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
                directory: "./packages/babel-core/",
            },
            github(
                "babel/babel",
                "https://github.com/babel/babel/tree/HEAD/packages/babel-core",
                "packages/babel-core",
            ),
        ],
        [
            "https://github.com/babel/babel/tree/main/packages/babel-core#readme",
            github(
                "babel/babel",
                "https://github.com/babel/babel/tree/main/packages/babel-core",
                "packages/babel-core",
            ),
        ],
        [
            {
                url: "https://user:token@github.com/owner/repo.git",
                directory: "packages/a b",
            },
            github(
                "owner/repo",
                "https://github.com/owner/repo/tree/HEAD/packages/a%20b",
                "packages/a b",
            ),
        ],
        [
            { url: "https://github.com/owner/repo.git", directory: "." },
            github("owner/repo", "https://github.com/owner/repo"),
        ],
        [
            {
                url: "https://github.com/owner/repo.git",
                directory: "../../../../evil/repo",
            },
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
                text: "bitbucket.org/user/repo",
                href: "https://bitbucket.org/user/repo",
            },
        ],
        [
            "https://bitbucket.org/owner/repo/src/main/packages/core",
            {
                text: "bitbucket.org/owner/repo",
                directory: "src/main/packages/core",
                href: "https://bitbucket.org/owner/repo/src/main/packages/core",
            },
        ],
        [
            "gist:11081aaa281",
            {
                text: "gist.github.com/11081aaa281",
                href: "https://gist.github.com/11081aaa281",
            },
        ],
        [
            "https://git.sr.ht/~user/repo",
            {
                text: "git.sr.ht/~user/repo",
                href: "https://git.sr.ht/~user/repo",
            },
        ],
        [
            "gitlab:user/repo",
            {
                host: "gitlab",
                text: "user/repo",
                href: "https://gitlab.com/user/repo",
            },
        ],
    ])("%j → %j", (repository, expected) => {
        expect(repositoryLink(repository)).toEqual(expected);
    });

    it.each([
        "git+https://git.example.com/owner/repo.git",
        "https://git.example.com/owner/repo",
        "https://user:token@git.example.com/owner/repo.git",
        "git://git.example.com/owner/repo.git",
        "github.com/user/repo",
        "https://gitlab.com/owner/repo/-/tree/main/packages/core",
        "javascript:alert(1)",
        "not a repository",
    ])("shows %j as text without a link", (url) => {
        expect(repositoryLink({ url })).toEqual({ text: url });
    });

    it.each([
        { type: "git" },
        { url: "  " },
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
            {
                text: "example.com/docs",
                href: "https://example.com/docs",
            },
        ],
        ["example.com", { text: "example.com" }],
        [
            "http://example.com/",
            { text: "http://example.com/", href: "http://example.com/" },
        ],
        [
            "https://github.com@evil.example/login",
            { text: "https://github.com@evil.example/login" },
        ],
        [
            "https://user:token@example.com/",
            { text: "https://user:token@example.com/" },
        ],
        ["javascript:alert(1)", { text: "javascript:alert(1)" }],
        ["see the readme", { text: "see the readme" }],
        ["README.md", { text: "README.md" }],
    ])("%j → %j", (homepage, expected) => {
        expect(homepageLink(homepage)).toEqual(expected);
    });

    it.each([undefined, "", "  ", ["https://example.com/"]])(
        "has no homepage for %j",
        (homepage) => {
            expect(
                homepageLink(homepage as Manifest["homepage"]),
            ).toBeUndefined();
        },
    );

    it.each([
        ["https://github.com/owner/repo", "owner/repo"],
        ["https://github.com/owner/repo#readme", "owner/repo"],
        ["http://github.com/Owner/Repo/", "owner/repo"],
        [
            "https://github.com/owner/repo/tree/HEAD/packages/x",
            { url: "github:owner/repo", directory: "packages/x" },
        ],
    ])("is hidden when %j is the repository %j", (homepage, repository) => {
        expect(
            homepageLink(homepage, repositoryLink(repository)),
        ).toBeUndefined();
    });

    it.each([
        ["https://github.com/owner/other", "owner/repo"],
        [
            "https://github.com/owner/repo/tree/main/packages/foo#readme",
            "owner/repo",
        ],
        ["https://github.com/owner/repo/tree/main/docs", "owner/repo"],
        ["https://gitlab.com/group/repo", "gitlab:group/repo#main"],
        [
            "https://github.com/owner/repo#readme",
            { url: "github:owner/repo", directory: "packages/x" },
        ],
    ])(
        "keeps %j, a page other than the repository %j",
        (homepage, repository) => {
            expect(
                homepageLink(homepage, repositoryLink(repository))?.href,
            ).toBe(homepage);
        },
    );
});

describe("createCatalogSummary", () => {
    const source = (latestManifest: Partial<Manifest> | null) =>
        ({
            name: "example",
            versions: {
                "1.0.0": "2020-01-01T00:00:00.000Z",
                "2.0.0": "2021-01-01T00:00:00.000Z",
            },
            latestManifest: latestManifest && {
                version: "2.0.0",
                ...latestManifest,
            },
        }) as CatalogSource;

    it("summarizes the latest version", () => {
        expect(
            createCatalogSummary(
                source({
                    description: "An example",
                    license: "MIT",
                    author: "Jane Doe <jane@example.com>",
                    repository: "github:owner/example",
                    homepage: "https://example.com/",
                    keywords: ["one", "two"],
                    maintainers: [{ name: "a" }, { name: "b" }],
                }),
            ),
        ).toEqual({
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
        });
    });

    it("doesn't link a non-http homepage", () => {
        const summary = createCatalogSummary(
            source({ homepage: "javascript:alert(1)" }),
        );
        expect(summary.latest?.homepage).toEqual({
            text: "javascript:alert(1)",
        });
    });

    it("drops fields that aren't strings", () => {
        expect(
            createCatalogSummary(
                source({
                    description: { text: "An example" },
                    homepage: ["https://example.com/"],
                    keywords: ["one", { name: "two" }, 3, "one"],
                    maintainers: { name: "a" },
                } as unknown as Partial<Manifest>),
            ).latest,
        ).toEqual({
            version: "2.0.0",
            time: "2021-01-01T00:00:00.000Z",
            keywords: ["one"],
            maintainersCount: 0,
        });
    });

    it("omits latest when there is no latest manifest", () => {
        expect(createCatalogSummary(source(null))).toEqual({
            name: "example",
            versions: ["1.0.0", "2.0.0"],
        });
    });
});

describe("getCatalogSummary", () => {
    const requiredVersion = () => getPackageVersionsMock.mock.calls[0][1];

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it("combines the latest manifest with versions that include it", async () => {
        fetchLatestManifestMock.mockResolvedValue({
            version: "2.0.0",
            description: "An example",
        });
        getPackageVersionsMock.mockResolvedValue({
            versions: {
                "1.0.0": "2020-01-01T00:00:00.000Z",
                "2.0.0": "2021-01-01T00:00:00.000Z",
            },
            tags: { latest: "2.0.0" },
        });

        const summary = await getCatalogSummary("example");

        await expect(requiredVersion()).resolves.toBe("2.0.0");
        expect(summary.versions).toEqual(["1.0.0", "2.0.0"]);
        expect(summary.latest).toMatchObject({
            version: "2.0.0",
            time: "2021-01-01T00:00:00.000Z",
            description: "An example",
        });
    });

    it("lists versions without a latest manifest", async () => {
        fetchLatestManifestMock.mockResolvedValue(null);
        getPackageVersionsMock.mockResolvedValue({
            versions: { "1.0.0-beta.0": "2020-01-01T00:00:00.000Z" },
            tags: { beta: "1.0.0-beta.0" },
        });

        await expect(getCatalogSummary("example")).resolves.toEqual({
            name: "example",
            versions: ["1.0.0-beta.0"],
        });
        await expect(requiredVersion()).resolves.toBeUndefined();
    });

    it("lists versions when the latest manifest can't be fetched", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        fetchLatestManifestMock.mockRejectedValue(new Error("503"));
        getPackageVersionsMock.mockResolvedValue({
            versions: {
                "1.0.0": "2020-01-01T00:00:00.000Z",
                "2.0.0": "2021-01-01T00:00:00.000Z",
            },
            tags: { latest: "2.0.0" },
        });

        await expect(getCatalogSummary("example")).resolves.toEqual({
            name: "example",
            versions: ["1.0.0", "2.0.0"],
            latestUnavailable: true,
        });
        await expect(requiredVersion()).resolves.toBeUndefined();
    });

    it("throws when the package doesn't exist", async () => {
        fetchLatestManifestMock.mockResolvedValue(null);
        getPackageVersionsMock.mockResolvedValue(null);

        await expect(getCatalogSummary("does-not-exist")).rejects.toThrow(
            "Package not found: does-not-exist",
        );
    });
});
