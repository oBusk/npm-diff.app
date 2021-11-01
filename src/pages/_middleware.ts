import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import getAllVersions, { Version } from "^/lib/api/versions";

type Middleware = (
    req: NextRequest,
    res?: NextFetchEvent,
) => Promise<Response | undefined> | Response | undefined;

const router: Middleware = (request) => {
    console.log("Router");
    console.log(JSON.stringify(request, null, 2));
    switch (request.nextUrl.pathname) {
        case "/api/versions":
            return versions(request);
        default:
            return NextResponse.next();
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
    });
};

export default router;
