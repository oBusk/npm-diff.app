import { NextFetchEvent, NextRequest } from "next/server";
import getAllVersions, { Version } from "^/lib/api/versions";
import { responseCacheSwr } from "^/lib/utils/headers";

type Middleware = (
    req: NextRequest,
    res?: NextFetchEvent,
) => Promise<Response | undefined> | Response | undefined;

const router: Middleware = (request) => {
    switch (request?.nextUrl?.pathname) {
        case "/api/versions":
            return versions(request);
    }
};

export type ApiVersionsResponse = Array<Version>;

const versions: Middleware = async (request) => {
    const spec = request.nextUrl.searchParams.get("spec");

    if (spec == null) {
        throw new Error("spec is required");
    }

    const versions = await getAllVersions(Array.isArray(spec) ? spec[0] : spec);

    return new Response(JSON.stringify(versions), {
        status: 200,
        headers: {
            ...responseCacheSwr,
        },
    });
};

export default router;
