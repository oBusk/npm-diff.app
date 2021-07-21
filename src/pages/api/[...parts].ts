import npmDiff from "lib/npm-diff";
import splitParts from "lib/split-parts";
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

    const specsOrVersions = splitParts(parts);

    const result = await npmDiff(specsOrVersions, {
        diffNameOnly,
        diffUnified,
        diffIgnoreAllSpace,
        diffNoPrefix,
        diffSrcPrefix,
        diffDstPrefix,
        diffText,
    });

    if (result.type === "result") {
        res.status(200).send(result.diff);
    } else {
        const rawQuery = req.url?.match(/\?.*/);

        res.redirect(
            result.permanent
                ? STATUS_CODES.PERMANENT_REDIRECT
                : STATUS_CODES.TEMPORARY_REDIRECT,
            `/api/${result.destinationDiff}${rawQuery ?? ""}`,
        );
    }
};

export default apiEndpoint;
