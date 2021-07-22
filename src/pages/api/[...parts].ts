import destination from "lib/destination";
import parseQuery from "lib/parse-query";
import rawQuery from "lib/raw-query";
import specsToDiff from "lib/specs-to-diff";
import splitParts from "lib/split-parts";
import libnpmdiff from "libnpmdiff";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

enum STATUS_CODES {
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
}

const apiEndpoint: NextApiHandler<string> = async (req, res) => {
    const { parts, ...options } = req.query ?? {};

    const specsOrVersions = splitParts(parts);

    const { redirect, immutableSpecs } = await destination(specsOrVersions);

    if (redirect === false) {
        const diff = await libnpmdiff(immutableSpecs, parseQuery(options));

        res.status(200).send(diff);
    } else {
        res.redirect(
            redirect === "permanent"
                ? STATUS_CODES.PERMANENT_REDIRECT
                : STATUS_CODES.TEMPORARY_REDIRECT,
            `/api/${specsToDiff(immutableSpecs)}` + rawQuery(req),
        );
    }
};

export default apiEndpoint;
