import fetchManifest from "./manifest";

const response = (status: number, body: unknown = {}) => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
});

describe("fetchManifest", () => {
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

    it("fetches the manifest by escaped name and encoded version", async () => {
        fetchMock.mockResolvedValue(response(200, { version: "1.0.0" }));

        await expect(
            fetchManifest("@scope/name", "1.0.0+build/x"),
        ).resolves.toEqual({ version: "1.0.0" });
        expect(fetchMock.mock.calls[0][0]).toBe(
            "https://registry.npmjs.org/@scope%2fname/1.0.0%2Bbuild%2Fx",
        );
    });

    it("throws E404 when there is no such version", async () => {
        fetchMock.mockResolvedValue(response(404));

        await expect(fetchManifest("example", "latest")).rejects.toMatchObject({
            code: "E404",
        });
    });
});
