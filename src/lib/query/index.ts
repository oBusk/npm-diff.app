import libnpmdiff from "libnpmdiff";
import parseBoolean from "./parse-boolean";
import parseNumber from "./parse-number";
import parseString from "./parse-string";

export type QueryParams = {
    diffNameOnly?: string | string[];
    diffUnified?: string | string[];
    diffIgnoreAllSpace?: string | string[];
    diffNoPrefix?: string | string[];
    diffSrcPrefix?: string | string[];
    diffDstPrefix?: string | string[];
    diffText?: string | string[];
};

function parseQuery({
    diffNameOnly,
    diffUnified,
    diffIgnoreAllSpace,
    diffNoPrefix,
    diffSrcPrefix,
    diffDstPrefix,
    diffText,
}: QueryParams): libnpmdiff.Options {
    return {
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
