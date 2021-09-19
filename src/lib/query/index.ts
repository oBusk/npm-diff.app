import libnpmdiff from "libnpmdiff";
import parseBoolean from "./parseBoolean";
import parseNumber from "./parseNumber";
import parseString from "./parseString";

export interface QueryParams {
    diffFiles?: string | string[];
    diffNameOnly?: string | string[];
    diffUnified?: string | string[];
    diffIgnoreAllSpace?: string | string[];
    diffNoPrefix?: string | string[];
    diffSrcPrefix?: string | string[];
    diffDstPrefix?: string | string[];
    diffText?: string | string[];
}

function parseQuery({
    diffFiles,
    diffNameOnly,
    diffUnified,
    diffIgnoreAllSpace,
    diffNoPrefix,
    diffSrcPrefix,
    diffDstPrefix,
    diffText,
}: QueryParams): libnpmdiff.Options {
    return {
        diffFiles: typeof diffFiles === "string" ? [diffFiles] : diffFiles,
        diffNameOnly: parseBoolean(diffNameOnly),
        diffUnified: parseNumber(diffUnified),
        diffIgnoreAllSpace: parseBoolean(diffIgnoreAllSpace),
        diffNoPrefix: parseBoolean(diffNoPrefix),
        diffSrcPrefix: parseString(diffSrcPrefix),
        diffDstPrefix: parseString(diffDstPrefix),
        diffText: parseBoolean(diffText),
    };
}

export default parseQuery;
