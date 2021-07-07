import { npmDiff } from "lib/npm-diff";
import { partsToSpecs } from "lib/parts-to-specs";
import { NextApiRequest, NextApiResponse } from "next";

const apiEndpoint = async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const { parts } = req.query ?? {};

    const specs = partsToSpecs(parts);
    const diff = await npmDiff(specs);

    res.status(200).send(diff);
};

export default apiEndpoint;
