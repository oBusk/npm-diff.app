import immutableSpec from "./immutable-spec";
import pacote from "pacote";

const hashFinder = /(?:\#.*)?$/;

async function t(input: string, expected: string = "DEFAULT_VALUE") {
    expect(await immutableSpec(input)).toBe(expected);
}

interface ExpectedResults<T = string> {
    readonly latest: T;
    readonly next: T;
    readonly "^2.1": T;
    readonly "~2.1": T;
    readonly "^3.0.0-beta": T;
}

describe("immutableSpec", () => {
    let specs: ExpectedResults;

    beforeAll(async () => {
        // We need to use a package that is on the registry for this.
        // Using `chalk` as arbitrary popular package.

        const manifests: ExpectedResults<pacote.ManifestResult> = Object.freeze(
            {
                latest: await pacote.manifest("chalk"),
                next: await pacote.manifest("chalk@next"),
                "^2.1": await pacote.manifest(`chalk@^2.1`),
                "~2.1": await pacote.manifest(`chalk@~2.1`),
                "^3.0.0-beta": await pacote.manifest("chalk@^3.0.0-beta"),
            },
        );

        const versions: ExpectedResults = Object.freeze({
            latest: manifests["latest"].version,
            next: manifests["next"].version,
            "^2.1": manifests["^2.1"].version,
            "~2.1": manifests["~2.1"].version,
            "^3.0.0-beta": manifests["^3.0.0-beta"].version,
        });

        specs = Object.freeze({
            latest: `chalk@${versions["latest"]}`,
            next: `chalk@${versions["next"]}`,
            "^2.1": `chalk@${versions["^2.1"]}`,
            "~2.1": `chalk@${versions["~2.1"]}`,
            "^3.0.0-beta": `chalk@${versions["^3.0.0-beta"]}`,
        });
    });

    it("Takes registry specifier of type `version` and returns it instantly, it is already immutable.", () =>
        Promise.all([
            t("example@1.0.0", "example@1.0.0"),
            t("example@1.2.3", "example@1.2.3"),
        ]));

    it("Takes registry specifier of type `range` and returns with version.", () =>
        Promise.all([
            t("chalk", specs.latest),
            t("chalk@next", specs.next),
            t("chalk@^2.1", specs["^2.1"]),
            t("chalk@~2.1", specs["~2.1"]),
            t("chalk@^3.0.0-beta", specs["^3.0.0-beta"]),
            t("chalk@2.1.0 - 2.99.99", specs["^2.1"]),
            t("chalk@2.X.X", specs["^2.1"]),
        ]));

    it("Takes registry specifier of type `tag` and returns with version.", () =>
        Promise.all([
            t("chalk", specs.latest),
            t("chalk@latest", specs.latest),
            t("chalk@next", specs.next),
        ]));

    it("Takes registry specifier of type `git` and returns with commit", async () => {
        const resolved = Object.freeze({
            latest: await pacote.resolve("github:chalk/chalk"),
            "v2.4.1": await pacote.resolve("github:chalk/chalk#v2.4.1"),
            "semver:^2": await pacote.resolve("github:chalk/chalk#semver:^2"),
        });

        const hashes = Object.freeze({
            latest: resolved.latest.match(hashFinder)?.[0],
            "v2.4.1": resolved["v2.4.1"].match(hashFinder)?.[0],
            "semver:^2": resolved["semver:^2"].match(hashFinder)?.[0],
        });

        const expected = Object.freeze({
            latest: `github:chalk/chalk${hashes.latest}`,
            "v2.4.1": `github:chalk/chalk${hashes["v2.4.1"]}`,
            "semver:^2": `github:chalk/chalk${hashes["semver:^2"]}`,
        });

        await Promise.all([
            t(expected.latest, expected.latest),
            t("github:chalk/chalk", expected.latest),
            t("github:chalk/chalk#v2.4.1", expected["v2.4.1"]),
            t("github:chalk/chalk#semver:^2", expected["semver:^2"]),
        ]);
    });

    it("Takes registry specifier of type `remote` and returns with commit", async () => {
        const expected = Object.freeze({
            latest: await pacote.resolve(
                "git+ssh://git@github.com/chalk/chalk.git",
            ),
            "v2.4.1": await pacote.resolve(
                "git+ssh://git@github.com/chalk/chalk.git#v2.4.1",
            ),
            "semver:^2": await pacote.resolve(
                "git+ssh://git@github.com/chalk/chalk.git#semver:^2",
            ),
        });

        await Promise.all([
            t(expected.latest, expected.latest),
            t("git+ssh://git@github.com/chalk/chalk.git", expected.latest),
            t(
                "git+ssh://git@github.com/chalk/chalk.git#v2.4.1",
                expected["v2.4.1"],
            ),
            t(
                "git+ssh://git@github.com/chalk/chalk.git#semver:^2",
                expected["semver:^2"],
            ),
        ]);
    });

    describe("Takes registry specifier of type `alias` and resolves sub spec.", () => {
        it("Latest", () => t("myalias@npm:chalk", specs.latest));
        it("Version sub spec", () =>
            t("myalias@npm:chalk@1.0.1", "chalk@1.0.1"));
        it("Range sub spec", () => t("myalias@npm:chalk@^2.1", specs["^2.1"]));
        it("Tag sub spec", () => t("myalias@npm:chalk@next", specs.next));
        it("Throw on file sub spec", () => {
            const expectedError = `Unsupported registry specifier type: "file"`;

            expect(() => t("myalias@~/example.tgz")).rejects.toThrow(
                expectedError,
            );
            expect(() => t("myalias@d:/example.tar")).rejects.toThrow(
                expectedError,
            );
        });

        it("Throw on directory sub spec", () => {
            const expectedError = `Unsupported registry specifier type: "directory"`;

            expect(() => t("myalias@~/example")).rejects.toThrow(expectedError);
            expect(() => t("myalias@d:/example")).rejects.toThrow(
                expectedError,
            );
        });
    });

    it("Throws on specifier of type `file`", () => {
        const expectedError = `Unsupported registry specifier type: "file"`;

        // We could test with backslashes, but that's only when running on windows.
        // And forwardslash should work on all platforms.
        expect(() => t(".example.tgz")).rejects.toThrow(expectedError);
        expect(() => t("~/example.tar.gz")).rejects.toThrow(expectedError);
        expect(() => t("c:/dir/example.tar")).rejects.toThrow(expectedError);
        expect(() => t("/a/b/example.tgz")).rejects.toThrow(expectedError);
        expect(() => t("file:example.tar")).rejects.toThrow(expectedError);
    });

    it("Throws on specifier of type `directory`", () => {
        const expectedError = `Unsupported registry specifier type: "directory"`;

        // We could test with backslashes, but that's only when running on windows.
        // And forwardslash should work on all platforms.
        expect(() => t(".example")).rejects.toThrow(expectedError);
        expect(() => t("~/example.")).rejects.toThrow(expectedError);
        expect(() => t("c:/dir/example")).rejects.toThrow(expectedError);
        expect(() => t("/a/b/example")).rejects.toThrow(expectedError);
        expect(() => t("file:example")).rejects.toThrow(expectedError);
    });
});
