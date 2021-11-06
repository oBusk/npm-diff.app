import packument from "^/lib/api/npm/packument";
import { responseCacheSwr } from "^/lib/utils/headers";
import { Middleware } from "./Middleware";

export type VersionsEndpointResponse = string[];

export const versionsEndpoint: Middleware = async (request) => {
    const start = Date.now();
    const spec = request.nextUrl.searchParams.get("spec");

    if (spec == null) {
        throw new Error("spec is required");
    }

    const name = Array.isArray(spec) ? spec[0] : spec;

    const result = await packument(spec);

    const versions = Object.values(result.versions).map(
        ({ version }) => version,
    );

    return new Response(JSON.stringify(versions), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "x-request-time-ms": `${Date.now() - start}`,
            ...responseCacheSwr,
        },
    });
};
