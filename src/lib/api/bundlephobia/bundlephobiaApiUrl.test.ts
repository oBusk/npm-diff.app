import bundlephobiaApiUrl from "./bundlephobiaApiUrl";

describe("bundlephobiaApiUrl", () => {
    it("encodes unscoped specs", () => {
        expect(bundlephobiaApiUrl("react@18.2.0")).toBe(
            "https://bundlephobia.com/api/size?package=react%4018.2.0",
        );
    });

    it("encodes scoped specs", () => {
        const url = new URL(bundlephobiaApiUrl("@babel/core@7.24.0"));
        expect(url.origin + url.pathname).toBe(
            "https://bundlephobia.com/api/size",
        );
        expect(url.searchParams.get("package")).toBe("@babel/core@7.24.0");
    });

    it("preserves build metadata and reserved characters", () => {
        const spec = "react@1.0.0+build.1&x=#y";
        const url = new URL(bundlephobiaApiUrl(spec));
        expect([...url.searchParams.keys()]).toEqual(["package"]);
        expect(url.searchParams.get("package")).toBe(spec);
        expect(url.hash).toBe("");
    });
});
