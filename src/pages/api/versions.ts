import { NextApiHandler } from "next";
import getAllVersions, { Version } from "^/lib/api/versions";
import { setSwrCaching } from "^/lib/utils/headers";

export type ApiVersionsResponse = Array<Version>;

const versions: NextApiHandler<ApiVersionsResponse> = async (req, res) => {
    const { spec } = req.query ?? {};

    if (spec == null) {
        throw new Error("spec is required");
    }

    const versions = await getAllVersions(Array.isArray(spec) ? spec[0] : spec);

    setSwrCaching(res);

    res.status(200).send(versions);
};

export default versions;
