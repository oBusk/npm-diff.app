import packument from "^/lib/api/npm/packument";
import getCachedVersionsFromNpmSearch from "^/lib/api/npmSearch/versions.cached";
import getPackageVersions from "./packageVersions";

jest.mock("^/lib/api/npmSearch/versions.cached", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("^/lib/api/npm/packument", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const getVersionsFromNpmSearchMock =
    getCachedVersionsFromNpmSearch as jest.Mock;
const packumentMock = packument as jest.Mock;

describe("getPackageVersions", () => {
    const indexed = {
        versions: {
            "1.0.0": "2020-01-01T00:00:00.000Z",
            "2.0.0": "2021-01-01T00:00:00.000Z",
        },
        tags: { latest: "2.0.0" },
    };

    const registryDoc = {
        time: {
            created: "2019-01-01T00:00:00.000Z",
            "2.0.0": "2021-01-01T00:00:00.000Z",
            "3.0.0": "2022-01-01T00:00:00.000Z",
        },
        versions: { "2.0.0": {}, "3.0.0": {} },
    };

    const registryVersions = {
        "2.0.0": "2021-01-01T00:00:00.000Z",
        "3.0.0": "2022-01-01T00:00:00.000Z",
    };

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it.each([undefined, "2.0.0"])(
        "uses npm-search when it includes %p",
        async (including) => {
            getVersionsFromNpmSearchMock.mockResolvedValue(indexed);

            await expect(
                getPackageVersions("example", including),
            ).resolves.toEqual(indexed.versions);
            expect(packumentMock).not.toHaveBeenCalled();
        },
    );

    it.each([
        ["the package isn't indexed", null],
        ["the version isn't indexed yet", indexed],
        [
            "npm-search only has one version",
            { versions: { "3.0.0": "2022-01-01T00:00:00.000Z" } },
        ],
    ])("falls back to the registry when %s", async (_, searchResult) => {
        getVersionsFromNpmSearchMock.mockResolvedValue(searchResult);
        packumentMock.mockResolvedValue(registryDoc);

        await expect(getPackageVersions("example", "3.0.0")).resolves.toEqual(
            registryVersions,
        );
        expect(packumentMock).toHaveBeenCalledWith("example");
    });

    it("falls back to the registry when npm-search fails", async () => {
        getVersionsFromNpmSearchMock.mockRejectedValue(new Error("down"));
        packumentMock.mockResolvedValue(registryDoc);

        await expect(getPackageVersions("example")).resolves.toEqual(
            registryVersions,
        );
    });

    it("keeps versions the registry has no publish time for", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        packumentMock.mockResolvedValue({
            ...registryDoc,
            time: { "2.0.0": "2021-01-01T00:00:00.000Z" },
        });

        await expect(getPackageVersions("example")).resolves.toEqual({
            "2.0.0": "2021-01-01T00:00:00.000Z",
            "3.0.0": undefined,
        });
    });

    it.each([
        [
            "the registry doesn't have the package",
            () =>
                packumentMock.mockRejectedValue(
                    Object.assign(new Error("Not found"), { code: "E404" }),
                ),
        ],
        [
            "the registry packument has no versions",
            () =>
                packumentMock.mockResolvedValue({
                    time: { unpublished: { time: "2021-01-01T00:00:00.000Z" } },
                }),
        ],
    ])("has no versions when %s", async (_, mockRegistry) => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        mockRegistry();

        await expect(getPackageVersions("example")).resolves.toBeNull();
    });

    it("rethrows other registry errors", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        packumentMock.mockRejectedValue(new Error("boom"));

        await expect(getPackageVersions("example")).rejects.toThrow("boom");
    });
});
