import searchNpmSearch from "./client";
import getVersionsFromNpmSearch from "./versions";

jest.mock("./client", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const searchNpmSearchMock = searchNpmSearch as unknown as jest.Mock;

describe("getVersionsFromNpmSearch", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("queries by objectID and requests only versions/tags", async () => {
        searchNpmSearchMock.mockResolvedValue([
            { objectID: "react", versions: { "1.0.0": "" } },
        ]);

        await getVersionsFromNpmSearch("react");

        expect(searchNpmSearchMock).toHaveBeenCalledWith({
            query: "",
            filters: 'objectID:"react"',
            hitsPerPage: 1,
            attributesToRetrieve: ["versions", "tags"],
        });
    });

    it("filters by objectID for scoped package names", async () => {
        searchNpmSearchMock.mockResolvedValue([
            {
                objectID: "@types/node",
                versions: { "1.0.0": "" },
            },
        ]);

        await getVersionsFromNpmSearch("@types/node");

        expect(searchNpmSearchMock).toHaveBeenCalledWith(
            expect.objectContaining({ filters: 'objectID:"@types/node"' }),
        );
    });

    it("returns versions and tags from the hit", async () => {
        searchNpmSearchMock.mockResolvedValue([
            {
                objectID: "react",
                versions: { "1.0.0": "2020-01-01T00:00:00.000Z" },
                tags: { latest: "1.0.0" },
            },
        ]);

        await expect(getVersionsFromNpmSearch("react")).resolves.toEqual({
            versions: { "1.0.0": "2020-01-01T00:00:00.000Z" },
            tags: { latest: "1.0.0" },
        });
    });

    it("defaults tags to an empty object when absent", async () => {
        searchNpmSearchMock.mockResolvedValue([
            {
                objectID: "react",
                versions: { "1.0.0": "2020-01-01T00:00:00.000Z" },
            },
        ]);

        await expect(getVersionsFromNpmSearch("react")).resolves.toEqual({
            versions: { "1.0.0": "2020-01-01T00:00:00.000Z" },
            tags: {},
        });
    });

    it("returns null when there is no hit", async () => {
        searchNpmSearchMock.mockResolvedValue([]);

        await expect(
            getVersionsFromNpmSearch("does-not-exist"),
        ).resolves.toBeNull();
    });

    it("returns null when the hit has no versions", async () => {
        searchNpmSearchMock.mockResolvedValue([
            { objectID: "react" },
        ]);

        await expect(getVersionsFromNpmSearch("react")).resolves.toBeNull();
    });

    it("returns null when the hit's versions map is empty", async () => {
        searchNpmSearchMock.mockResolvedValue([
            { objectID: "react", versions: {} },
        ]);

        await expect(getVersionsFromNpmSearch("react")).resolves.toBeNull();
    });
});
