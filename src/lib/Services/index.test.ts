import { Bundlephobia, NpmjsCom, Packagephobia, unpkg } from ".";

const scoped = { name: "@babel/core", version: "7.24.0" };
const buildMetadata = { name: "react", version: "1.0.0+build.1" };

describe("Services", () => {
    describe("NpmjsCom.url", () => {
        it("keeps scoped names as path segments", () => {
            expect(NpmjsCom.url(scoped)).toBe(
                "https://www.npmjs.com/package/@babel/core/v/7.24.0",
            );
        });

        it("encodes build metadata in the version", () => {
            expect(NpmjsCom.url(buildMetadata)).toBe(
                "https://www.npmjs.com/package/react/v/1.0.0%2Bbuild.1",
            );
        });
    });

    describe("Bundlephobia.url", () => {
        it("keeps scoped names as path segments", () => {
            expect(Bundlephobia.url(scoped)).toBe(
                "https://bundlephobia.com/package/@babel/core@7.24.0/",
            );
        });

        it("encodes build metadata in the version", () => {
            expect(Bundlephobia.url(buildMetadata)).toBe(
                "https://bundlephobia.com/package/react@1.0.0%2Bbuild.1/",
            );
        });
    });

    describe("Packagephobia.url", () => {
        it("round-trips scoped names through the query", () => {
            const url = new URL(Packagephobia.url(scoped));
            expect(url.origin + url.pathname).toBe(
                "https://packagephobia.com/result",
            );
            expect(url.searchParams.get("p")).toBe("@babel/core@7.24.0");
        });

        it("round-trips build metadata through the query", () => {
            const url = new URL(Packagephobia.url(buildMetadata));
            expect(url.search).not.toContain("+");
            expect(url.searchParams.get("p")).toBe("react@1.0.0+build.1");
        });
    });

    describe("unpkg.url", () => {
        it("keeps scoped names and path separators", () => {
            expect(unpkg.url(scoped, "lib/index.js")).toBe(
                "https://unpkg.com/browse/@babel/core@7.24.0/lib/index.js",
            );
        });

        it("defaults to the package root", () => {
            expect(unpkg.url(scoped)).toBe(
                "https://unpkg.com/browse/@babel/core@7.24.0/",
            );
        });

        it("encodes build metadata in the version", () => {
            expect(unpkg.url(buildMetadata, "index.js")).toBe(
                "https://unpkg.com/browse/react@1.0.0%2Bbuild.1/index.js",
            );
        });

        it("encodes reserved characters in each path segment", () => {
            const href = unpkg.url(scoped, "dir name/a#b?c%d.js");
            expect(href).toBe(
                "https://unpkg.com/browse/@babel/core@7.24.0/dir%20name/a%23b%3Fc%25d.js",
            );

            const url = new URL(href);
            expect(url.hash).toBe("");
            expect(url.search).toBe("");
            expect(decodeURIComponent(url.pathname)).toBe(
                "/browse/@babel/core@7.24.0/dir name/a#b?c%d.js",
            );
        });
    });
});
