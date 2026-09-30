import fetchLatestManifest from "./latestManifest";

const response = (status: number, body: unknown = {}) => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
});

describe("fetchLatestManifest", () => {
    const originalFetch = globalThis.fetch;
    const fetchMock = jest.fn();

    beforeAll(() => {
        globalThis.fetch = fetchMock;
    });

    afterAll(() => {
        globalThis.fetch = originalFetch;
    });

    afterEach(() => {
        fetchMock.mockReset();
    });

    it("fetches the latest manifest of a scoped package", async () => {
        fetchMock.mockResolvedValue(response(200, { version: "1.0.0" }));

        await expect(fetchLatestManifest("@scope/name")).resolves.toEqual({
            version: "1.0.0",
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toBe(
            "https://registry.npmjs.org/@scope%2fname/latest",
        );
    });

    it("returns null when there is no latest version", async () => {
        fetchMock.mockResolvedValue(response(404));

        await expect(fetchLatestManifest("example")).resolves.toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("retries once after a failure", async () => {
        fetchMock
            .mockResolvedValueOnce(response(503))
            .mockResolvedValueOnce(response(200, { version: "1.0.0" }));

        await expect(fetchLatestManifest("example")).resolves.toEqual({
            version: "1.0.0",
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("throws when the retry fails too", async () => {
        fetchMock
            .mockRejectedValueOnce(new Error("timeout"))
            .mockResolvedValueOnce(response(503));

        await expect(fetchLatestManifest("example")).rejects.toThrow(
            "Registry returned 503",
        );
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
