import { NextResponse } from "next/server";
import getVersionData from "^/lib/api/npm/getVersionData";
import { type Version, VERSIONS_PARAMETER_PACKAGE } from "./types";

export const runtime = "edge";

export async function GET(request: Request) {
    const start = Date.now();

    const { searchParams } = new URL(request.url);
    const spec = searchParams.get(VERSIONS_PARAMETER_PACKAGE);

    if (spec == null) {
        return new Response("spec is required", { status: 400 });
    }

    if (Array.isArray(spec)) {
        return new Response("spec must be a string", { status: 400 });
    }

    const versionMap = await getVersionData(spec);

    const versions: Version[] = Object.entries(versionMap).map(
        ([version, data]) => ({
            version,
            ...data,
        }),
    );

    return NextResponse.json(versions, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "x-request-time-ms": `${Date.now() - start}`,
            "cache-control": [
                "public",
                // Cache 5 minutes
                `max-age=${5 * 60}`,
                // Serve up to 1d old data, while revalidating
                `stale-while-revalidate=${24 * 60 * 60}`,
            ].join(", "),
        },
    });
}
