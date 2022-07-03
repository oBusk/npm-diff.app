import pacote from "pacote";
import d, { Redirect } from ".";

interface ExpectedResults<T = string> {
    readonly "^2.1": T;
    readonly "~2.1": T;
    readonly latest: T;
    readonly "^3.0.0-beta": T;
    readonly next: T;
}

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["t"] }] */
async function t(
    input: [string, string] | [string],
    expectedSpecs?: [string, string],
    expectedRedirect?: Redirect,
) {
    expect(await d(input)).toStrictEqual({
        canonicalSpecs: expectedSpecs,
        redirect: expectedRedirect,
    });
}

describe("destination()", () => {
    let specs: ExpectedResults;

    beforeAll(async () => {
        const manifests: ExpectedResults<pacote.ManifestResult> = Object.freeze(
            {
                "^2.1": await pacote.manifest(`chalk@^2.1`),
                "~2.1": await pacote.manifest(`chalk@~2.1`),
                latest: await pacote.manifest("chalk"),
                "^3.0.0-beta": await pacote.manifest("chalk@^3.0.0-beta"),
                next: await pacote.manifest("chalk@next"),
            },
        );

        const versions: ExpectedResults = Object.freeze({
            "^2.1": manifests["^2.1"].version,
            "~2.1": manifests["~2.1"].version,
            latest: manifests["latest"].version,
            "^3.0.0-beta": manifests["^3.0.0-beta"].version,
            next: manifests["next"].version,
        });

        specs = Object.freeze({
            "^2.1": `chalk@${versions["^2.1"]}`,
            "~2.1": `chalk@${versions["~2.1"]}`,
            latest: `chalk@${versions["latest"]}`,
            "^3.0.0-beta": `chalk@${versions["^3.0.0-beta"]}`,
            next: `chalk@${versions["next"]}`,
        });
    });

    describe("using specific version", () => {
        it("package@version x2", () =>
            t(
                ["chalk@3.0.0", "chalk@4.1.1"],
                ["chalk@3.0.0", "chalk@4.1.1"],
                false,
            ));
    });

    describe("no version (fallback to latest)", () => {
        it("package | package", () =>
            t(["chalk", "chalk"], [specs.latest, specs.latest], "temporary"));

        it("package@version | package", () =>
            t(
                ["chalk@4.1.0", "chalk"],
                ["chalk@4.1.0", specs.latest],
                "temporary",
            ));

        it("package | package@version", () =>
            t(
                ["chalk", "chalk@4.1.1"],
                [specs.latest, "chalk@4.1.1"],
                "temporary",
            ));
    });

    describe("semver", () => {
        it("package@semver | package", () =>
            t(
                ["chalk@^2.1", "chalk"],
                [specs["^2.1"], specs.latest],
                "temporary",
            ));
        it("package | package@semver", () =>
            t(
                ["chalk", "chalk@^2.1"],
                [specs.latest, specs["^2.1"]],
                "temporary",
            ));

        it("package@~ | package@^", () =>
            t(
                ["chalk@~2.1", "chalk@^2.1"],
                [specs["~2.1"], specs["^2.1"]],
                "temporary",
            ));
        it("package@2.1.x | package@2.x", () =>
            t(
                ["chalk@2.1.x", "chalk@2.x"],
                [specs["~2.1"], specs["^2.1"]],
                "temporary",
            ));

        it("package@^3.0.0-beta | package", () =>
            t(
                ["chalk@^3.0.0-beta", "chalk"],
                [specs["^3.0.0-beta"], specs.latest],
                "temporary",
            ));
    });

    describe("tag", () => {
        it("package@latest | package@next", () =>
            t(
                ["chalk@latest", "chalk@next"],
                [specs.latest, specs.next],
                "temporary",
            ));
    });

    describe("omit package name in one input", () => {
        describe("specific versions", () => {
            it("package@version | version", () =>
                t(
                    ["chalk@3.0.0", "3.0.1"],
                    ["chalk@3.0.0", "chalk@3.0.1"],
                    "permanent",
                ));

            it("version | package@version", () =>
                t(
                    ["3.0.1", "chalk@3.0.0"],
                    ["chalk@3.0.1", "chalk@3.0.0"],
                    "permanent",
                ));

            it("Throws on version | version", () =>
                expect(() => t(["3.0.1", "3.0.1"])).rejects.toThrow(
                    "One of the spec",
                ));
        });

        describe("semver", () => {
            it("package@version | semver", () =>
                t(
                    ["chalk@2.0.0", "^2.1"],
                    ["chalk@2.0.0", specs["^2.1"]],
                    "temporary",
                ));

            it("semver | package@version", () =>
                t(
                    ["^2.1", "chalk@2.0.0"],
                    [specs["^2.1"], "chalk@2.0.0"],
                    "temporary",
                ));

            it("Throws on semver | semver", () =>
                expect(() => t(["^2.1", "^2.1"])).rejects.toThrow(
                    "One of the spec",
                ));
        });
    });

    describe("provide single spec, compare with latest always", () => {
        it("specific version", () =>
            t(["chalk@3.0.1"], ["chalk@3.0.1", specs.latest], "temporary"));

        it("specific tag", () =>
            t(["chalk@latest"], [specs.latest, specs.latest], "temporary"));

        it("semver", () =>
            t(["chalk@^2.1"], [specs["^2.1"], specs.latest], "temporary"));

        it("no version (fallback to latest)", () =>
            t(["chalk"], [specs.latest, specs.latest], "temporary"));

        it("Throws on only semver", () =>
            expect(() => t(["^2.1"])).rejects.toThrow(/package name/i));

        it("Throws on only version", () =>
            expect(() => t(["3.0.1"])).rejects.toThrow(/package name/i));
    });
});
