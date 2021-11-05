import getAllVersions, { Version } from "^/lib/api/versions";
import { Middleware } from "^/lib/middleware/Middleware";
import { responseCacheSwr } from "^/lib/utils/headers";

const router: Middleware = (request) => {
    switch (request?.nextUrl?.pathname) {
        case "/api/versions":
            return versions(request);
    }
};

export type ApiVersionsResponse = Array<Version>;

const versions: Middleware = async (request) => {
    const start = Date.now();
    const spec = request.nextUrl.searchParams.get("spec");

    if (spec == null) {
        throw new Error("spec is required");
    }

    const name = Array.isArray(spec) ? spec[0] : spec;

    return new Response(JSON.stringify(await getAllVersions(name)), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "x-request-time-ms": `${Date.now() - start}`,
            ...responseCacheSwr,
        },
    });
};

export default router;
