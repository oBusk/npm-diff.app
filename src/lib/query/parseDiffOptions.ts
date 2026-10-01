import { braceExpand } from "minimatch";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import { type NpmDiffOptions } from "^/lib/npmDiff";
import parseQuery from "./parseQuery";
import type QueryParams from "./QueryParams";

const MAX_DIFF_FILES = 10;
const MAX_DIFF_FILES_PATTERN_LENGTH = 256;
const MAX_DIFF_FILES_BRACE_EXPANSION = 16;
const MAX_DIFF_FILES_STARS = 2;
const MAX_DIFF_UNIFIED = 100;
const MAX_DIFF_PREFIX_LENGTH = 64;

// Same normalization libnpmdiff applies before matching, so `\{a,b}`
// can't slip past the checks as a literal brace.
function normalizeMatch(pattern: string): string {
    return pattern.replace(/\\+/g, "/").replace(/^\.\/|^\./, "");
}

/**
 * minimatch compiles globs to backtracking regexes. Extglobs and more than two
 * `*` in a pattern can take seconds to match a single long file name, and
 * libnpmdiff matches every pattern against every file in both tarballs.
 * `**` path segments are not counted, they match whole segments.
 */
function isSlowGlob(pattern: string): boolean {
    if (/[!@?*+]\(/.test(pattern)) {
        return true;
    }
    const stars = pattern
        .split("/")
        .filter((segment) => segment !== "**")
        .join("/")
        .match(/\*+/g);
    return (stars?.length ?? 0) > MAX_DIFF_FILES_STARS;
}

function validateDiffFiles(diffFiles: string[]): string | undefined {
    if (diffFiles.length > MAX_DIFF_FILES) {
        return `Too many diffFiles patterns, at most ${MAX_DIFF_FILES} are allowed.`;
    }

    let alternatives = 0;
    for (const pattern of diffFiles) {
        if (pattern.length > MAX_DIFF_FILES_PATTERN_LENGTH) {
            return `diffFiles patterns can be at most ${MAX_DIFF_FILES_PATTERN_LENGTH} characters long.`;
        }
        if (pattern === DEFAULT_DIFF_FILES_GLOB) {
            alternatives++;
            continue;
        }

        const expanded = braceExpand(normalizeMatch(pattern), {
            braceExpandMax: MAX_DIFF_FILES_BRACE_EXPANSION + 1,
        });
        alternatives += expanded.length;
        if (alternatives > MAX_DIFF_FILES_BRACE_EXPANSION) {
            return `diffFiles patterns can expand to at most ${MAX_DIFF_FILES_BRACE_EXPANSION} alternatives in total.`;
        }
        if (expanded.some(isSlowGlob)) {
            return `diffFiles patterns can not use extglobs like !(...) and can have at most ${MAX_DIFF_FILES_STARS} * outside of ** segments.`;
        }
    }

    return undefined;
}

function validatePrefix(
    name: string,
    prefix: string | undefined,
): string | undefined {
    if (prefix == null) {
        return undefined;
    }
    if (prefix.length > MAX_DIFF_PREFIX_LENGTH) {
        return `${name} can be at most ${MAX_DIFF_PREFIX_LENGTH} characters long.`;
    }
    // Prefixes are written verbatim into the ---/+++ header lines
    if (/[\x00-\x1f\x7f]/.test(prefix)) {
        return `${name} can not contain control characters.`;
    }
    return undefined;
}

function validateOptions({
    diffFiles,
    diffUnified,
    diffSrcPrefix,
    diffDstPrefix,
}: NpmDiffOptions): string | undefined {
    if (diffFiles != null) {
        const diffFilesError = validateDiffFiles(diffFiles);
        if (diffFilesError) {
            return diffFilesError;
        }
    }

    if (
        diffUnified != null &&
        !(
            Number.isInteger(diffUnified) &&
            diffUnified >= 0 &&
            diffUnified <= MAX_DIFF_UNIFIED
        )
    ) {
        return `diffUnified must be an integer between 0 and ${MAX_DIFF_UNIFIED}.`;
    }

    return (
        validatePrefix("diffSrcPrefix", diffSrcPrefix) ??
        validatePrefix("diffDstPrefix", diffDstPrefix)
    );
}

export default function parseDiffOptions(
    query: QueryParams,
): { ok: true; options: NpmDiffOptions } | { ok: false; message: string } {
    const options = parseQuery(query);
    const message = validateOptions(options);

    return message == null ? { ok: true, options } : { ok: false, message };
}
