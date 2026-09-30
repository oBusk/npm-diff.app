import packument from "^/lib/api/npm/packument";
import getCachedVersionsFromNpmSearch from "^/lib/api/npmSearch/versions.cached";
import getPublishTime from "./publishTime";

jest.mock("^/lib/api/npm/packument", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("^/lib/api/npmSearch/versions.cached", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const packumentMock = packument as jest.Mock;
const getCachedVersionsFromNpmSearchMock =
    getCachedVersionsFromNpmSearch as jest.Mock;

const registryDoc = {
    time: {
        "1.0.0": "2020-01-01T00:00:00.000Z",
        "2.0.0": "2021-01-01T00:00:00.000Z",
    },
};

describe("getPublishTime", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it("uses npm-search when it has the version", async () => {
        getCachedVersionsFromNpmSearchMock.mockResolvedValue({
            versions: { "1.0.0": "2020-01-01T00:00:00.000Z" },
            tags: {},
        });

        await expect(getPublishTime("example", "1.0.0")).resolves.toBe(
            "2020-01-01T00:00:00.000Z",
        );
        expect(getCachedVersionsFromNpmSearchMock).toHaveBeenCalledWith(
            "example",
        );
        expect(packumentMock).not.toHaveBeenCalled();
    });

    it.each([
        ["doesn't have the version", { versions: { "1.0.0": "" }, tags: {} }],
        ["doesn't have the package", null],
    ])(
        "falls back to the cached packument when npm-search %s",
        async (_, indexed) => {
            getCachedVersionsFromNpmSearchMock.mockResolvedValue(indexed);
            packumentMock.mockResolvedValue(registryDoc);

            await expect(getPublishTime("example", "2.0.0")).resolves.toBe(
                "2021-01-01T00:00:00.000Z",
            );
            expect(packumentMock).toHaveBeenCalledWith("example");
        },
    );

    it("falls back to the cached packument when npm-search fails", async () => {
        getCachedVersionsFromNpmSearchMock.mockRejectedValue(new Error("down"));
        packumentMock.mockResolvedValue(registryDoc);

        await expect(getPublishTime("example", "1.0.0")).resolves.toBe(
            "2020-01-01T00:00:00.000Z",
        );
    });

    it("has no time when the registry doesn't have the package", async () => {
        getCachedVersionsFromNpmSearchMock.mockResolvedValue(null);
        packumentMock.mockRejectedValue(
            Object.assign(new Error("Not found"), { code: "E404" }),
        );

        await expect(
            getPublishTime("does-not-exist", "1.0.0"),
        ).resolves.toBeUndefined();
    });
});
