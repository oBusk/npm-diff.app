import g from "./get-absolute-specs";
import pacote from "pacote";

async function t(input: [string, string], expected: [string, string]) {
    expect(await g(input)).toStrictEqual(expected);
}

// Essentially we want to make sure we can get a canonical absolute registry specifier
// for all combinations. We want to support all the cases mentioned in
// https://docs.npmjs.com/cli/v7/commands/npm-diff#synopsis
// With the exception that we never care about installed packages, we're always comparing
// packages from the registry.

interface ExpectedResults<T = string> {
    readonly "^2.1": T;
    readonly "~2.1": T;
    readonly latest: T;
    readonly "^3.0.0-beta": T;
    readonly next: T;
}

describe("getAbsoluteSpecs", () => {
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
            t(["chalk@3.0.0", "chalk@4.1.1"], ["chalk@3.0.0", "chalk@4.1.1"]));
    });

    describe("no version (fallback to latest)", () => {
        it("package | package", () =>
            t(["chalk", "chalk"], [specs.latest, specs.latest]));

        it("package@version | package", () =>
            t(["chalk@4.1.0", "chalk"], ["chalk@4.1.0", specs.latest]));

        it("package | package@version", () =>
            t(["chalk", "chalk@4.1.1"], [specs.latest, "chalk@4.1.1"]));
    });

    describe("semver", () => {
        it("package@semver | package", () =>
            t(["chalk@^2.1", "chalk"], [specs["^2.1"], specs.latest]));
        it("package | package@semver", () =>
            t(["chalk", "chalk@^2.1"], [specs.latest, specs["^2.1"]]));

        it("package@~ | package@^", () =>
            t(["chalk@~2.1", "chalk@^2.1"], [specs["~2.1"], specs["^2.1"]]));
        it("package@2.1.x | package@2.x", () =>
            t(["chalk@2.1.x", "chalk@2.x"], [specs["~2.1"], specs["^2.1"]]));

        it("package@2.1.x | package@2.x", () =>
            t(["chalk@2.1.x", "chalk@2.x"], [specs["~2.1"], specs["^2.1"]]));

        it("package@^3.0.0-beta | package", () =>
            t(
                ["chalk@^3.0.0-beta", "chalk"],
                [specs["^3.0.0-beta"], specs.latest],
            ));
    });

    describe("tag", () => {
        it("package@latest | package@next", () =>
            t(["chalk@latest", "chalk@next"], [specs.latest, specs.next]));
    });
});
