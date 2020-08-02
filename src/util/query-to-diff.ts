import { getDiff } from "./getDiff";
import { getPkgDetails } from "./getPkgDetails";
import { fetchTarBall } from "./npm-api";
import { parsePackageString } from "./npm-parser";

export async function queryToDiff(parts: string | string[]): Promise<string> {
    const query = typeof parts === "string" ? parts : parts.join("/");

    const [p1, p2] = query.split("...");

    const p1StringParse = parsePackageString(p1);
    const p2StringParse = parsePackageString(p2);

    const p1DetailsPromise = getPkgDetails(
        p1StringParse.name,
        p1StringParse.versionOrTag,
    );
    const p2DetailsPromise = getPkgDetails(
        p2StringParse.name,
        p2StringParse.versionOrTag,
    );

    const p1FilesPromise = p1DetailsPromise.then(({ tarballUrl }) =>
        fetchTarBall(tarballUrl),
    );
    const p2FilesPromise = p2DetailsPromise.then(({ tarballUrl }) =>
        fetchTarBall(tarballUrl),
    );

    const p1Result = {
        files: await p1FilesPromise,
        version: (await p1DetailsPromise).version,
    };
    const p2Result = {
        files: await p2FilesPromise,
        version: (await p2DetailsPromise).version,
    };

    const diff = getDiff(p1Result.files, p2Result.files);

    return diff;
}
