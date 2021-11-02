import { NextFetchEvent, NextRequest } from "next/server";
import getAllVersions, { Version } from "^/lib/api/versions";
import { responseCacheSwr } from "^/lib/utils/headers";

type Middleware = (
    req: NextRequest,
    res?: NextFetchEvent,
) => Promise<Response | undefined> | Response | undefined;

let requestNumber = 0;

const router: Middleware = (request) => {
    requestNumber++;
    console.log(`[${requestNumber}] ${request.url}`);
    switch (request?.nextUrl?.pathname) {
        case "/api/versions":
            return versions(request);
    }
};

export type ApiVersionsResponse = Array<Version>;

const versionsCache = new Map<string, Promise<ApiVersionsResponse>>();

const versions: Middleware = async (request) => {
    const start = Date.now();
    const spec = request.nextUrl.searchParams.get("spec");

    if (spec == null) {
        throw new Error("spec is required");
    }

    const name = Array.isArray(spec) ? spec[0] : spec;

    const cached = versionsCache.has(name);

    if (!cached) {
        versionsCache.set(name, getAllVersions(name));
    }

    return new Response(JSON.stringify(await versionsCache.get(name)), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "x-cached-in-middleware": cached ? "true" : "false",
            "x-cache-size": `${versionsCache.size}`,
            "x-handled": `${requestNumber}`,
            "x-request-time-ms": `${Date.now() - start}`,
            ...responseCacheSwr,
        },
    });
};

export default router;
