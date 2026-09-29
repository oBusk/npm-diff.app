import { fetchPackument } from "^/lib/api/npm/packument";
import getVersionsFromNpmSearch from "^/lib/api/npmSearch/versions";

export interface PackageVersions {
    versions: Record<string, string>;
    tags: Record<string, string>;
}

const isE404 = (e: unknown): boolean =>
    e instanceof Error && "code" in e && e.code === "E404";

async function versionsFromNpmSearch(
    packageName: string,
): Promise<PackageVersions | null> {
    try {
        return await getVersionsFromNpmSearch(packageName);
    } catch (e) {
        console.error(`[${packageName}] npm-search versions error:`, e);

        return null;
    }
}

async function versionsFromRegistry(
    packageName: string,
): Promise<PackageVersions | null> {
    try {
        const doc = await fetchPackument(packageName);

        return {
            versions: Object.fromEntries(
                Object.keys(doc.versions).map((version) => [
                    version,
                    doc.time?.[version] ?? "",
                ]),
            ),
            tags: doc["dist-tags"],
        };
    } catch (e) {
        if (isE404(e)) {
            return null;
        }

        throw e;
    }
}

export default async function getPackageVersions(
    packageName: string,
    requiredVersion?: string,
): Promise<PackageVersions | null> {
    const indexed = await versionsFromNpmSearch(packageName);

    if (
        indexed &&
        (requiredVersion == null ||
            Object.hasOwn(indexed.versions, requiredVersion))
    ) {
        return indexed;
    }

    return versionsFromRegistry(packageName);
}
