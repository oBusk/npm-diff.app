import { fetchPackument } from "^/lib/api/npm/packument";
import getVersionsFromNpmSearch from "^/lib/api/npmSearch/versions";
import getPackageVersions from "./packageVersions";

jest.mock("^/lib/api/npm/packument", () => ({
    fetchPackument: jest.fn(),
}));

jest.mock("^/lib/api/npmSearch/versions", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const fetchPackumentMock = fetchPackument as jest.Mock;
const getVersionsFromNpmSearchMock = getVersionsFromNpmSearch as jest.Mock;

const indexed = {
    versions: {
        "0.9.0": "2019-06-01T00:00:00.000Z",
        "1.0.0": "2020-01-01T00:00:00.000Z",
    },
    tags: { latest: "1.0.0" },
};

const registryDoc = {
    name: "example",
    "dist-tags": { latest: "2.0.0" },
    time: {
        created: "2019-01-01T00:00:00.000Z",
        "1.0.0": "2020-01-01T00:00:00.000Z",
        "2.0.0": "2021-01-01T00:00:00.000Z",
    },
    versions: { "1.0.0": {}, "2.0.0": {} },
};

const fromRegistry = {
    versions: {
        "1.0.0": "2020-01-01T00:00:00.000Z",
        "2.0.0": "2021-01-01T00:00:00.000Z",
    },
    tags: { latest: "2.0.0" },
};

describe("getPackageVersions", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it("uses npm-search when the package is indexed", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(indexed);

        await expect(getPackageVersions("example")).resolves.toEqual(indexed);
        expect(fetchPackumentMock).not.toHaveBeenCalled();
    });

    it("uses npm-search when it has the required version", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(indexed);

        await expect(getPackageVersions("example", "1.0.0")).resolves.toEqual(
            indexed,
        );
        expect(fetchPackumentMock).not.toHaveBeenCalled();
    });

    it("falls back to the registry when the package isn't indexed", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        fetchPackumentMock.mockResolvedValue(registryDoc);

        await expect(getPackageVersions("example")).resolves.toEqual(
            fromRegistry,
        );
        expect(fetchPackumentMock).toHaveBeenCalledWith("example");
    });

    it("falls back to the registry when the required version isn't indexed yet", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(indexed);
        fetchPackumentMock.mockResolvedValue(registryDoc);

        await expect(getPackageVersions("example", "2.0.0")).resolves.toEqual(
            fromRegistry,
        );
    });

    it("falls back to the registry when npm-search only has one version", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue({
            versions: { "2.0.0": "2021-01-01T00:00:00.000Z" },
            tags: { latest: "2.0.0" },
        });
        fetchPackumentMock.mockResolvedValue(registryDoc);

        await expect(getPackageVersions("example", "2.0.0")).resolves.toEqual(
            fromRegistry,
        );
    });

    it("keeps versions the registry has no publish time for", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        fetchPackumentMock.mockResolvedValue({
            ...registryDoc,
            time: { "1.0.0": "2020-01-01T00:00:00.000Z" },
        });

        const result = await getPackageVersions("example");

        expect(Object.keys(result!.versions)).toEqual(["1.0.0", "2.0.0"]);
        expect(result!.versions["2.0.0"]).toBeUndefined();
    });

    it("returns null when the registry packument has no versions", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        fetchPackumentMock.mockResolvedValue({
            name: "example",
            time: { unpublished: { time: "2021-01-01T00:00:00.000Z" } },
        });

        await expect(getPackageVersions("example")).resolves.toBeNull();
    });

    it("falls back to the registry when npm-search fails", async () => {
        getVersionsFromNpmSearchMock.mockRejectedValue(new Error("down"));
        fetchPackumentMock.mockResolvedValue(registryDoc);

        await expect(getPackageVersions("example")).resolves.toEqual(
            fromRegistry,
        );
    });

    it("returns null when the registry doesn't have the package", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        fetchPackumentMock.mockRejectedValue(
            Object.assign(new Error("Not found"), { code: "E404" }),
        );

        await expect(getPackageVersions("does-not-exist")).resolves.toBeNull();
    });

    it("rethrows other registry errors", async () => {
        getVersionsFromNpmSearchMock.mockResolvedValue(null);
        fetchPackumentMock.mockRejectedValue(new Error("boom"));

        await expect(getPackageVersions("example")).rejects.toThrow("boom");
    });
});
