import { braceExpand } from "minimatch";
import { type NpmDiffOptions } from "^/lib/npmDiff";
import parseQuery from "./parseQuery";
import type QueryParams from "./QueryParams";

export const MAX_DIFF_FILES = 10;
export const MAX_DIFF_FILES_PATTERN_LENGTH = 256;
export const MAX_DIFF_FILES_BRACE_EXPANSION = 64;
export const MAX_DIFF_UNIFIED = 100;
export const MAX_DIFF_PREFIX_LENGTH = 64;

export type ParseDiffOptionsResult =
    { ok: true; options: NpmDiffOptions } | { ok: false; message: string };

function braceExpansionExceedsLimit(pattern: string): boolean {
    return (
        braceExpand(pattern, {
            braceExpandMax: MAX_DIFF_FILES_BRACE_EXPANSION + 1,
        }).length > MAX_DIFF_FILES_BRACE_EXPANSION
    );
}

function validateDiffFiles(diffFiles: string[]): string | undefined {
    if (diffFiles.length > MAX_DIFF_FILES) {
        return `Too many diffFiles patterns, at most ${MAX_DIFF_FILES} are allowed.`;
    }

    for (const pattern of diffFiles) {
        if (pattern.length > MAX_DIFF_FILES_PATTERN_LENGTH) {
            return `diffFiles patterns can be at most ${MAX_DIFF_FILES_PATTERN_LENGTH} characters long.`;
        }
        if (braceExpansionExceedsLimit(pattern)) {
            return `diffFiles patterns can expand to at most ${MAX_DIFF_FILES_BRACE_EXPANSION} alternatives.`;
        }
    }

    return undefined;
}

function validatePrefix(
    name: string,
    prefix: string | undefined,
): string | undefined {
    if (prefix != null && prefix.length > MAX_DIFF_PREFIX_LENGTH) {
        return `${name} can be at most ${MAX_DIFF_PREFIX_LENGTH} characters long.`;
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
): ParseDiffOptionsResult {
    const options = parseQuery(query);
    const message = validateOptions(options);

    return message == null ? { ok: true, options } : { ok: false, message };
}
