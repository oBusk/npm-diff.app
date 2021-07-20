import { arrayEquals } from "lib/array-equals";
import { getAbsoluteSpecs } from "lib/get-absolute-specs";
import { parseBoolean, parseString, paseNumber } from "lib/parse-query";
import { partsToSpecs } from "lib/parts-to-specs";
import libnpmdiff from "libnpmdiff";
import { NextApiRequest, NextApiResponse } from "next";

enum STATUS_CODES {
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
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

    const absoluteSpecs = await getAbsoluteSpecs(specs);

    if (arrayEquals(specs, absoluteSpecs)) {
        const diff = await libnpmdiff(specs, {
            diffNameOnly: parseBoolean(diffNameOnly),
            diffUnified: paseNumber(diffUnified),
            diffIgnoreAllSpace: parseBoolean(diffIgnoreAllSpace),
            diffNoPrefix: parseBoolean(diffNoPrefix),
            diffSrcPrefix: parseString(diffSrcPrefix),
            diffDstPrefix: parseString(diffDstPrefix),
            diffText: parseBoolean(diffText),
        });

        res.status(200).send(diff);
    } else {
        const rawQuery = req.url?.match(/\?.*$/);

        res.redirect(
            // TODO: Could be permanent in some situations.
            STATUS_CODES.TEMPORARY_REDIRECT,
            `/api/${absoluteSpecs[0]}...${absoluteSpecs[1]}${rawQuery ?? ""}`,
        );
    }
};

export default apiEndpoint;
