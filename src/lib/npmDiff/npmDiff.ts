import type { Options } from "libnpmdiff";
import { cacheLife } from "next/cache";
import { hasErrorCode } from "^/lib/utils/hasErrorCode";
import type { NpmDiffError } from "./NpmDiffError";
import { LibnpmdiffTimeoutError, runLibnpmdiff } from "./runLibnpmdiff";

export const NPM_DIFF_TIMEOUT_MS = 40_000;

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
        const result = await runLibnpmdiff(specs, options, NPM_DIFF_TIMEOUT_MS);

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

        if (e instanceof LibnpmdiffTimeoutError) {
            cacheLife("days");

            return {
                ok: false,
                kind: "timeout",
                message: `The diff took too long to compute. Run "npm diff --diff=${specs[0]} --diff=${specs[1]}" locally instead.`,
            };
        }

        const isEtarget = (e: unknown): e is ErrorETARGET =>
            hasErrorCode(e, "ETARGET");
        const isE404 = (e: unknown): e is Error404 => hasErrorCode(e, "E404");

        if (isEtarget(e)) {
            cacheLife("days");

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
            cacheLife("days");

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
