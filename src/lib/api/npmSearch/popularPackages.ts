import searchNpmSearch from "./client";
import type NpmSearchHit from "./NpmSearchHit";

export default async function getPopularPackages(
    size: number,
): Promise<NpmSearchHit[]> {
    return searchNpmSearch<NpmSearchHit>({
        query: "",
        filters: "popular:true",
        hitsPerPage: size,
        attributesToRetrieve: ["name", "description"],
    });
}
