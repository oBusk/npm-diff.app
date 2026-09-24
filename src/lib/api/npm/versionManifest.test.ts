import { versionManifestUrl } from "./versionManifest";

describe("versionManifestUrl", () => {
    it("builds the URL for an unscoped package", () => {
        expect(versionManifestUrl("semver", "7.6.3")).toBe(
            "https://registry.npmjs.org/semver/7.6.3",
        );
    });

    it("escapes the slash in scoped package names", () => {
        expect(
            versionManifestUrl("@obusk/eslint-config-next", "15.1.2-6"),
        ).toBe(
            "https://registry.npmjs.org/@obusk%2feslint-config-next/15.1.2-6",
        );
    });

    it("encodes the version", () => {
        expect(versionManifestUrl("semver", "1.0.0+build/x")).toBe(
            "https://registry.npmjs.org/semver/1.0.0%2Bbuild%2Fx",
        );
    });

    it("throws for an invalid package name", () => {
        expect(() => versionManifestUrl("", "1.0.0")).toThrow();
    });
});
