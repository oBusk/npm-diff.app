import destination from "lib/destination";
import parseQuery from "lib/parse-query";
import specsToDiff from "lib/specs-to-diff";
import splitParts from "lib/split-parts";
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

    const specsOrVersions = splitParts(parts);

    const { redirect, immutableSpecs: specs } = await destination(
        specsOrVersions,
    );

    if (redirect === false) {
        const diff = await libnpmdiff(
            specs,
            parseQuery({
                diffNameOnly,
                diffUnified,
                diffIgnoreAllSpace,
                diffNoPrefix,
                diffSrcPrefix,
                diffDstPrefix,
                diffText,
            }),
        );

        res.status(200).send(diff);
    } else {
        const rawQuery = req.url?.match(/\?.*/);

        res.redirect(
            redirect === "permanent"
                ? STATUS_CODES.PERMANENT_REDIRECT
                : STATUS_CODES.TEMPORARY_REDIRECT,
            `/api/${specsToDiff(specs)}${rawQuery ?? ""}`,
        );
    }
};

export default apiEndpoint;
