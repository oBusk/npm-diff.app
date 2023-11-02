import libnpmdiff, { type Options } from "libnpmdiff";
import { cache } from "react";

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

async function _npmDiff(
    specs: [string, string],
    options: Options,
): Promise<string> {
    let startTime = 0;
    try {
        startTime = Date.now();
        const result = await libnpmdiff(specs, options);

        console.log("_doDiff", {
            specs,
            options,
            duration: Date.now() - startTime,
        });

        return result;
    } catch (e: any) {
        console.error("_doDiff", {
            error: e,
            specs,
            options,
            duration: Date.now() - startTime,
        });

        const isEtarget = (e: any): e is ErrorETARGET => e.code === "ETARGET";
        const isE404 = (e: any): e is Error404 => e.code === "E404";

        if (isEtarget(e)) {
            const code = 404;

            if (e.type === "version") {
                throw {
                    code,
                    error: `Could not find version ${e.wanted}.`,
                };
            }

            throw {
                code,
                error: `Could not find`,
            };
        }

        if (isE404(e)) {
            const code = 404;

            throw {
                code,
                error: `Could not find package that matches "${e.pkgid}"`,
            };
        }

        throw {
            code: 500,
            error: "Unknown error",
        };
    }
}

const cachedNpmDiff = cache((str: string) => {
    const args = JSON.parse(str) as Parameters<typeof _npmDiff>;

    return _npmDiff(...args);
});

const npmDiff = (...args: Parameters<typeof _npmDiff>) =>
    cachedNpmDiff(JSON.stringify(args));

export default npmDiff;
