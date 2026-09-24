import packagephobiaApiUrl from "./packagephobiaApiUrl";

describe("packagephobiaApiUrl", () => {
    it("encodes unscoped specs", () => {
        expect(packagephobiaApiUrl("react@18.2.0")).toBe(
            "https://packagephobia.com/v2/api.json?p=react%4018.2.0",
        );
    });

    it("encodes scoped specs", () => {
        const url = new URL(packagephobiaApiUrl("@babel/core@7.24.0"));
        expect(url.origin + url.pathname).toBe(
            "https://packagephobia.com/v2/api.json",
        );
        expect(url.searchParams.get("p")).toBe("@babel/core@7.24.0");
    });

    it("preserves build metadata and reserved characters", () => {
        const spec = "react@1.0.0+build.1&x=#y";
        const url = new URL(packagephobiaApiUrl(spec));
        expect([...url.searchParams.keys()]).toEqual(["p"]);
        expect(url.searchParams.get("p")).toBe(spec);
        expect(url.hash).toBe("");
    });
});
