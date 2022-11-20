import libnpmdiff, { Options } from "libnpmdiff";
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

export interface DiffError {
    code: number;
    error: string;
}

const doDiff = cache(async function _doDiff(
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
});

export default doDiff;
