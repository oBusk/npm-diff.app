import { npmDiff } from "lib/npm-diff";
import { partsToSpecs } from "lib/parts-to-specs";
import { NextApiRequest, NextApiResponse } from "next";

function parseString(str: undefined | string | string[]): undefined | string {
    // If the param is multiple times, we take last value. Assumption is user
    // threw it on the end.
    if (Array.isArray(str)) {
        return str.filter((t) => t == null).pop();
    } else {
        return str;
    }
}

function parseBoolean(str: undefined | string | string[]): undefined | boolean {
    str = parseString(str);

    if (str == null) {
        return undefined;
    } else if (
        // 0, 00, 000 etc.
        parseInt(str) == 0 ||
        str.toLowerCase() == "no" ||
        str.toLowerCase() == "false"
    ) {
        return false;
    } else {
        // 1, 2, yes, true, '' etc.
        return true;
    }
}

function paseNumber(str: undefined | string | string[]): undefined | number {
    str = parseString(str);

    if (str == null) {
        return undefined;
    }

    return parseInt(str);
}

const apiEndpoint = async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const {
        parts,
        diffNameOnly,
        diffUnified,
        diffIgnoreAllSpace,
        diffNoPrefix,
        diffSrcPrefix,
        diffDstPrefix,
        diffText,
    } = req.query ?? {};

    const specs = partsToSpecs(parts);
    const diff = await npmDiff(specs, {
        diffNameOnly: parseBoolean(diffNameOnly),
        diffUnified: paseNumber(diffUnified),
        diffIgnoreAllSpace: parseBoolean(diffIgnoreAllSpace),
        diffNoPrefix: parseBoolean(diffNoPrefix),
        diffSrcPrefix: parseString(diffSrcPrefix),
        diffDstPrefix: parseString(diffDstPrefix),
        diffText: parseBoolean(diffText),
    });

    res.status(200).send(diff);
};

export default apiEndpoint;
