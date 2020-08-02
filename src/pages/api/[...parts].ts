import { NextApiRequest, NextApiResponse } from "next";
import { queryToDiff } from "util/query-to-diff";

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const { parts = "" } = req.query ?? {};

    const diff = await queryToDiff(parts);

    res.status(200).send(diff);
};
