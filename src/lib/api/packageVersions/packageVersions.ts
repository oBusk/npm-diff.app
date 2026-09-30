import { fetchPackument } from "^/lib/api/npm/packument";
import getVersionsFromNpmSearch from "^/lib/api/npmSearch/versions";
import { hasErrorCode } from "^/lib/utils/hasErrorCode";

export interface PackageVersions {
    versions: Record<string, string | undefined>;
    tags: Record<string, string>;
}

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
        const versions = Object.keys(doc.versions ?? {});

        if (versions.length === 0) {
            return null;
        }

        return {
            versions: Object.fromEntries(
                versions.map((version) => [version, doc.time?.[version]]),
            ),
            tags: doc["dist-tags"] ?? {},
        };
    } catch (e) {
        if (hasErrorCode(e, "E404")) {
            return null;
        }

        throw e;
    }
}

function isComplete(
    { versions }: PackageVersions,
    requiredVersion: string | undefined,
): boolean {
    const isTruncatedToLatest = Object.keys(versions).length === 1;

    return (
        !isTruncatedToLatest &&
        (requiredVersion == null || Object.hasOwn(versions, requiredVersion))
    );
}

export default async function getPackageVersions(
    packageName: string,
    requiredVersion?: string | Promise<string | undefined>,
): Promise<PackageVersions | null> {
    const [indexed, required] = await Promise.all([
        versionsFromNpmSearch(packageName),
        requiredVersion,
    ]);

    if (indexed && isComplete(indexed, required)) {
        return indexed;
    }

    return versionsFromRegistry(packageName);
}
