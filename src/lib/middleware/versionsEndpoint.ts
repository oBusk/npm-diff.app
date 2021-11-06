import getAllVersions, { Version } from "^/lib/api/versions";
import { responseCacheSwr } from "^/lib/utils/headers";
import { Middleware } from "./Middleware";

export type VersionsEndpointResponse = Array<Version>;

export const versionsEndpoint: Middleware = async (request) => {
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
