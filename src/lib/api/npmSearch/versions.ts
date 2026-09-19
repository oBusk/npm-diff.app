import searchNpmSearch from "./client";
import type NpmSearchHit from "./NpmSearchHit";

export interface NpmSearchVersions {
    versions: Record<string, string>;
    tags: Record<string, string>;
}

export default async function getVersionsFromNpmSearch(
    packageName: string,
): Promise<NpmSearchVersions | null> {
    const [hit] = await searchNpmSearch<NpmSearchHit>({
        query: "",
        filters: `objectID:"${packageName}"`,
        hitsPerPage: 1,
        attributesToRetrieve: ["versions", "tags"],
    });

    if (!hit?.versions || Object.keys(hit.versions).length === 0) {
        return null;
    }

    return { versions: hit.versions, tags: hit.tags ?? {} };
}
