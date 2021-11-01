import { NextFetchEvent, NextRequest } from "next/server";
import getAllVersions from "^/lib/api/versions";

type Middleware = (
    req: NextRequest,
    res?: NextFetchEvent,
) => Promise<Response | undefined> | Response | undefined;

const router: Middleware = (request) => {
    switch (request.nextUrl.pathname) {
        case "/api/versions":
            return versions(request);
    }
};

const versions: Middleware = async (request) => {
    const spec = request.nextUrl.searchParams.get("spec");

    if (spec == null) {
        throw new Error("spec is required");
    }

    const versions = await getAllVersions(Array.isArray(spec) ? spec[0] : spec);

    return new Response(JSON.stringify(versions), {
        status: 200,
    });
};

export default router;
