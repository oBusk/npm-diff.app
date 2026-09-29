import { cacheLife } from "next/cache";
import getPackageVersions, { type PackageVersions } from "./packageVersions";

export default async function getCachedPackageVersions(
    packageName: string,
    requiredVersion?: string,
): Promise<PackageVersions | null> {
    "use cache";
    cacheLife("hours");

    return getPackageVersions(packageName, requiredVersion);
}
