import destination from "_/lib/destination";
import parseQuery from "_/lib/query";
import { setDefaultPageCaching } from "_/lib/utils/headers";
import rawQuery from "_/lib/utils/rawQuery";
import specsToDiff from "_/lib/utils/specsToDiff";
import splitParts from "_/lib/utils/splitParts";
import libnpmdiff from "libnpmdiff";
import { NextApiHandler } from "next";

enum STATUS_CODES {
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
}

const apiEndpoint: NextApiHandler<string> = async (req, res) => {
    const { parts, ...options } = req.query ?? {};

    const specsOrVersions = splitParts(parts);

    const { redirect, immutableSpecs } = await destination(specsOrVersions);

    if (redirect !== "temporary") {
        setDefaultPageCaching(res);
    }

    if (redirect === false) {
        const diff = await libnpmdiff(immutableSpecs, parseQuery(options));

        res.status(200).send(diff);
    } else {
        res.redirect(
            redirect === "permanent"
                ? STATUS_CODES.PERMANENT_REDIRECT
                : STATUS_CODES.TEMPORARY_REDIRECT,
            `/api/${specsToDiff(immutableSpecs)}` + rawQuery(req, "parts"),
        );
    }
};

export default apiEndpoint;
