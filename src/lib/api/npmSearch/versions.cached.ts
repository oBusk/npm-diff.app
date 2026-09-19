import { cacheLife } from "next/cache";
import getVersionsFromNpmSearch, { type NpmSearchVersions } from "./versions";

export default async function getCachedVersionsFromNpmSearch(
    packageName: string,
): Promise<NpmSearchVersions | null> {
    "use cache";
    cacheLife("hours");

    return getVersionsFromNpmSearch(packageName);
}
