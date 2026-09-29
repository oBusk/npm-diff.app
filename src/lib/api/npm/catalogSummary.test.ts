import getPackageVersions from "^/lib/api/packageVersions/packageVersions";
import getCatalogSummary, {
    authorName,
    type CatalogSource,
    createCatalogSummary,
    licenseText,
    repositoryUrl,
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
                repositoryUrl: "https://github.com/owner/example",
                homepageUrl: "https://example.com/",
                keywords: ["one", "two"],
                maintainersCount: 2,
            },
        });
    });

    it("drops a non-http homepage", () => {
        const summary = createCatalogSummary(
            source({ homepage: "javascript:alert(1)" }),
        );
        expect(summary.latest?.homepageUrl).toBeUndefined();
    });

    it("omits latest when there is no latest manifest", () => {
        expect(createCatalogSummary(source(null))).toEqual({
            name: "example",
            versions: ["1.0.0", "2.0.0"],
        });
    });
});

describe("getCatalogSummary", () => {
    afterEach(() => {
        jest.resetAllMocks();
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

        expect(getPackageVersionsMock).toHaveBeenCalledWith("example", "2.0.0");
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
        expect(getPackageVersionsMock).toHaveBeenCalledWith(
            "example",
            undefined,
        );
    });

    it("throws when the package doesn't exist", async () => {
        fetchLatestManifestMock.mockResolvedValue(null);
        getPackageVersionsMock.mockResolvedValue(null);

        await expect(getCatalogSummary("does-not-exist")).rejects.toThrow(
            "Package not found: does-not-exist",
        );
    });
});
