import libnpmdiff, { type Options } from "libnpmdiff";
import { cacheLife } from "next/cache";
import type { NpmDiffError } from "./Error";

export type NpmDiffResult =
    { ok: true; diff: string } | ({ ok: false } & NpmDiffError);

interface ErrorETARGET {
    code: "ETARGET";
    type: "version";
    wanted: string;
    versions: string[];
    distTags: Record<string, string>;
    defaultTag: string;
}

interface Error404 {
    code: "E404";
    pkgid: string;
}

async function npmDiff(
    specs: [string, string],
    options: Options,
): Promise<NpmDiffResult> {
    "use cache: remote";

    let startTime = 0;
    try {
        startTime = Date.now();
        const result = await libnpmdiff(specs, options);

        cacheLife("max");

        console.log("_doDiff", {
            specs,
            options,
            duration: Date.now() - startTime,
        });

        return { ok: true, diff: result };
    } catch (e: unknown) {
        console.error("_doDiff", {
            error: e,
            specs,
            options,
            duration: Date.now() - startTime,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isEtarget = (e: any): e is ErrorETARGET => e.code === "ETARGET";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isE404 = (e: any): e is Error404 => e.code === "E404";

        if (isEtarget(e)) {
            cacheLife("max");

            if (e.type === "version") {
                return {
                    ok: false,
                    kind: "not-found",
                    message: `Could not find version ${e.wanted}.`,
                };
            }

            return { ok: false, kind: "not-found", message: "Could not find" };
        }

        if (isE404(e)) {
            cacheLife("max");

            return {
                ok: false,
                kind: "not-found",
                message: `Could not find package that matches "${e.pkgid}"`,
            };
        }

        cacheLife("hours");

        return { ok: false, kind: "unknown", message: "Unknown error" };
    }
}

export default npmDiff;
