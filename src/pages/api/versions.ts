import { type NextRequest } from "next/server";
import packument from "^/lib/api/npm/packument";

export const VERSIONS_PARAMETER_SPEC = "spec";
export type Version = { version: string; tags?: string[] };
export type SpecsEndpointResponse = Version[];

export const config = {
    runtime: "experimental-edge",
};

export default async function versions(req: NextRequest) {
    const start = Date.now();

    const { searchParams } = new URL(req.url);
    const spec = searchParams.get(VERSIONS_PARAMETER_SPEC);

    if (spec == null) {
        return new Response("spec is required", { status: 400 });
    }

    if (Array.isArray(spec)) {
        return new Response("spec must be a string", { status: 400 });
    }

    const result = await packument(spec);

    const tags = result["dist-tags"];
    /**
     * Create map from each version in the tags to the tag names. This is to
     * avoid having to do a find on the `tags` for every single version.
     *
     * ```ts
     * {
     *  "1.0.0": ["latest", "bauxite"],
     *  "1.0.0-beta.1": ["next"],
     * }
     * ```
     */
    const versionToTags = Object.entries(tags).reduce((acc, [tag, version]) => {
        if (acc[version]) {
            acc[version].push(tag);
        } else {
            acc[version] = [tag];
        }
        return acc;
    }, {} as Record<string, string[]>);
    const versions = Object.values(result.versions).map(({ version }) => ({
        version,
        tags: versionToTags[version],
    }));

    return new Response(JSON.stringify(versions), {
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
