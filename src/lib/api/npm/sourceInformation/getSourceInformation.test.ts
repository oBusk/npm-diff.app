import versionManifest from "../versionManifest";
import { getSourceFromManifest } from "./getSourceFromManifest";
import { getSourceInformation } from "./getSourceInformation";
import type { SourceInformation } from "./sourceInformation";

jest.mock("../versionManifest", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("./getSourceFromManifest", () => ({
    getSourceFromManifest: jest.fn(),
}));

const mockVersionManifest = versionManifest as jest.MockedFunction<
    typeof versionManifest
>;
const mockGetSourceFromManifest = getSourceFromManifest as jest.MockedFunction<
    typeof getSourceFromManifest
>;

const spec = { name: "pkg", version: "1.0.0" };
const manifest = {} as NonNullable<Awaited<ReturnType<typeof versionManifest>>>;

describe("getSourceInformation", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns none when the version manifest is missing", async () => {
        mockVersionManifest.mockResolvedValue(null);

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "none",
        });
    });

    it("returns none when the manifest has no provenance", async () => {
        mockVersionManifest.mockResolvedValue(manifest);
        mockGetSourceFromManifest.mockResolvedValue(undefined);

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "none",
        });
    });

    it("returns found with the source information", async () => {
        const sourceInformation = {
            repositoryUrl: "https://github.com/owner/repo",
        } as SourceInformation;
        mockVersionManifest.mockResolvedValue(manifest);
        mockGetSourceFromManifest.mockResolvedValue(sourceInformation);

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "found",
            sourceInformation,
        });
    });

    it("returns undetermined and logs when the manifest fetch fails", async () => {
        mockVersionManifest.mockRejectedValue(new Error("timeout"));

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "undetermined",
        });
        expect(console.error).toHaveBeenCalled();
    });

    it("returns undetermined when provenance parsing fails", async () => {
        mockVersionManifest.mockResolvedValue(manifest);
        mockGetSourceFromManifest.mockRejectedValue(
            new Error("Unsupported SLSA Provenance v1 BuildDefinition type"),
        );

        await expect(getSourceInformation(spec)).resolves.toEqual({
            status: "undetermined",
        });
    });
});
