import { npmDiff } from "lib/npm-diff";
import { parseBoolean, parseString, paseNumber } from "lib/parse-query";
import { partsToSpecs } from "lib/parts-to-specs";
import { NextApiRequest, NextApiResponse } from "next";

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
