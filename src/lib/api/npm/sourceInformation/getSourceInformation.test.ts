import fetchManifest from "../manifest";
import { getSourceFromManifest } from "./getSourceFromManifest";
import { getSourceInformation } from "./getSourceInformation";
import type { SourceInformation } from "./sourceInformation";

jest.mock("next/cache", () => ({
    cacheLife: jest.fn(),
}));

jest.mock("../manifest", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("./getSourceFromManifest", () => ({
    getSourceFromManifest: jest.fn(),
}));

const mockFetchManifest = fetchManifest as jest.MockedFunction<
    typeof fetchManifest
>;
const mockGetSourceFromManifest = getSourceFromManifest as jest.MockedFunction<
    typeof getSourceFromManifest
>;

const spec = { name: "pkg", version: "1.0.0" };
const manifest = {} as Awaited<ReturnType<typeof fetchManifest>>;

describe("getSourceInformation", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns none when the manifest has no provenance", async () => {
        mockFetchManifest.mockResolvedValue(manifest);
        mockGetSourceFromManifest.mockResolvedValue(undefined);

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "none",
        });
    });

    it("returns found with the source information", async () => {
        const sourceInformation = {
            repositoryUrl: "https://github.com/owner/repo",
        } as SourceInformation;
        mockFetchManifest.mockResolvedValue(manifest);
        mockGetSourceFromManifest.mockResolvedValue(sourceInformation);

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "found",
            sourceInformation,
        });
    });

    it("returns undetermined and logs when the manifest fetch fails", async () => {
        mockFetchManifest.mockRejectedValue(new Error("timeout"));

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "undetermined",
        });
        expect(console.error).toHaveBeenCalled();
    });

    it("returns undetermined when provenance parsing fails", async () => {
        mockFetchManifest.mockResolvedValue(manifest);
        mockGetSourceFromManifest.mockRejectedValue(
            new Error("Unsupported SLSA Provenance v1 BuildDefinition type"),
        );

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "undetermined",
        });
    });
});
