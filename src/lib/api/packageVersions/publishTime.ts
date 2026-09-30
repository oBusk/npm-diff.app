import packument from "^/lib/api/npm/packument";
import getCachedVersionsFromNpmSearch from "^/lib/api/npmSearch/versions.cached";
import { hasErrorCode } from "^/lib/utils/hasErrorCode";

async function publishTimeFromNpmSearch(
    packageName: string,
    version: string,
): Promise<string | undefined> {
    try {
        const indexed = await getCachedVersionsFromNpmSearch(packageName);

        return indexed?.versions[version] || undefined;
    } catch (e) {
        console.error(`[${packageName}] npm-search versions error:`, e);

        return undefined;
    }
}

async function publishTimeFromRegistry(
    packageName: string,
    version: string,
): Promise<string | undefined> {
    try {
        const doc = await packument(packageName);

        return doc.time?.[version];
    } catch (e) {
        if (hasErrorCode(e, "E404")) {
            return undefined;
        }

        throw e;
    }
}

export default async function getPublishTime(
    packageName: string,
    version: string,
): Promise<string | undefined> {
    return (
        (await publishTimeFromNpmSearch(packageName, version)) ??
        publishTimeFromRegistry(packageName, version)
    );
}
