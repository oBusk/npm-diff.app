import { cacheLife } from "next/cache";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import buildVersionMap from "./buildVersionMap";
import packument from "./packument";
import type { VersionMap } from "./VersionData";

export type { VersionData, VersionMap, Version } from "./VersionData";

/**
 * Separate function that takes only packagename for better caching.
 *
 * We want `a@1.2.3` and `a@2.0.0` to share the same cache entry for `a`.
 */
async function getVersionMap(packageName: string): Promise<VersionMap> {
    "use cache";

    cacheLife("hours");

    const { time, "dist-tags": tags, versions } = await packument(packageName);

    const versionTimes: Record<string, string> = {};
    for (const version of Object.keys(versions)) {
        versionTimes[version] = time[version];
    }

    return buildVersionMap(versionTimes, tags);
}

async function getVersionData(
    spec: string | SimplePackageSpec,
): Promise<VersionMap> {
    const { name } =
        typeof spec === "string" ? createSimplePackageSpec(spec) : spec;

    return getVersionMap(name);
}

export default getVersionData;
