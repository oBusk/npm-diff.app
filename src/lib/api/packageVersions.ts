import packument from "^/lib/api/npm/packument";
import getCachedVersionsFromNpmSearch from "^/lib/api/npmSearch/versions.cached";
import { hasErrorCode } from "^/lib/utils/hasErrorCode";

export type PackageVersions = Record<string, string | undefined>;

async function versionsFromNpmSearch(
    packageName: string,
): Promise<PackageVersions | undefined> {
    try {
        return (await getCachedVersionsFromNpmSearch(packageName))?.versions;
    } catch (e) {
        console.error(`[${packageName}] npm-search versions error:`, e);

        return undefined;
    }
}

async function versionsFromRegistry(
    packageName: string,
): Promise<PackageVersions | null> {
    try {
        const doc = await packument(packageName);
        const versions = Object.keys(doc.versions ?? {});

        if (versions.length === 0) {
            return null;
        }

        return Object.fromEntries(
            versions.map((version) => [version, doc.time?.[version]]),
        );
    } catch (e) {
        if (hasErrorCode(e, "E404")) {
            return null;
        }

        throw e;
    }
}

// npm-search can lag behind the latest publish, and truncates some packages to only their latest version
export default async function getPackageVersions(
    packageName: string,
    including?: string,
): Promise<PackageVersions | null> {
    const indexed = await versionsFromNpmSearch(packageName);

    if (
        indexed &&
        Object.keys(indexed).length > 1 &&
        (including == null || Object.hasOwn(indexed, including))
    ) {
        return indexed;
    }

    return versionsFromRegistry(packageName).catch((e: unknown) => {
        if (!indexed) {
            throw e;
        }

        console.error(`[${packageName}] registry versions error:`, e);

        return indexed;
    });
}
