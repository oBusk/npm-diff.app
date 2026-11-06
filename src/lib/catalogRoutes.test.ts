import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { catalogRewrites } from "./catalogRoutes";
import { getCatalogPackageName, isCatalogPage } from "./utils/isCatalogPage";
import parseParts from "./utils/parseParts";

const matchers = catalogRewrites.map(({ source }) =>
    getPathMatch(source, { strict: true, removeUnnamedParams: true }),
);

const isRewrittenToCatalog = (path: string) =>
    matchers.some((match) => match(path) !== false);

const isCatalogPath = (path: string) => {
    const specs = parseParts(path.slice(1).split("/"), { decode: true });
    return specs != null && isCatalogPage(specs);
};

describe("catalogRewrites", () => {
    it.each([
        "/react",
        "/q",
        "/lodash.merge",
        "/left-pad",
        "/1",
        "/@types/node",
        "/%40types/node",
        "/@a/b",
        "/@angular/core",
    ])("rewrites catalog path %s", (path) => {
        expect(isCatalogPath(path)).toBe(true);
        expect(isRewrittenToCatalog(path)).toBe(true);
    });

    it.each([
        "/q%401.5.1",
        "/q%40latest",
        "/react%4018.0.0",
        "/react@18.0.0",
        "/react@1...react@2",
        "/react@1...2",
        "/1.0.0...react@2",
        "/q...q@2",
        "/@types/node@1.0.0",
        "/@types/node%401.0.0",
        "/%40types%2Fnode%401.0.0",
        "/@types/node@1...@types/node@2",
        "/@a/b%401.0.0",
        "/react%2E%2E%2E18.0.0",
        "/react%2e%2e%2e2",
        "/react%2E..18.0.0",
        "/@types/node%2E%2E%2E2",
    ])("does not rewrite diff path %s", (path) => {
        expect(isCatalogPath(path)).toBe(false);
        expect(isRewrittenToCatalog(path)).toBe(false);
    });

    it.each(["/react@*", "/@types/node@*", "/@types%2Fnode", "/re%61ct"])(
        "leaves catalog path %s to [...parts]",
        (path) => {
            expect(isCatalogPath(path)).toBe(true);
            expect(isRewrittenToCatalog(path)).toBe(false);
        },
    );

    it.each([
        "/react@*",
        "/@types/node@*",
        "/@types%2Fnode",
        "/re%61ct",
        "/React",
        "/a~b",
        "/a!b(c)*'",
        "/a_b",
    ])("rewrites the redirect target of catalog path %s", (path) => {
        const specs = parseParts(path.slice(1).split("/"), { decode: true });
        const name = specs && getCatalogPackageName(specs);
        expect(name).not.toBeNull();
        expect(isRewrittenToCatalog(`/${name}`)).toBe(true);
    });
});
