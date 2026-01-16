import { cacheLife } from "next/cache";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import packument from "./packument";

// Packuments include a lot of data, often enough to make them too large for the cache.
// For our diff page, and autocomplete, we want to find versions and which date and tag they have.
// So we build this data here, and run it throug the cache to cache this value.

export type VersionData = {
    time: string;
    tags?: string[];
};

export type VersionMap = {
    [version: string]: VersionData;
};

/**
 * Separate function that takes only packagename for better caching.
 *
 * We want `a@1.2.3` and `a@2.0.0` to share the same cache entry for `a`.
 */
async function getVersionMap(packageName: string): Promise<VersionMap> {
    "use cache";

    cacheLife("hours");

    const { time, "dist-tags": tags, versions } = await packument(packageName);

    const versionData: VersionMap = {};

    for (const [version] of Object.entries(versions)) {
        versionData[version] = { time: time[version] };
    }

    for (const [tag, version] of Object.entries(tags)) {
        const entry = versionData[version];
        if (entry) {
            if (entry.tags != null) {
                entry.tags.push(tag);
            } else {
                entry.tags = [tag];
            }
        }
    }

    return versionData;
}

async function getVersionData(
    spec: string | SimplePackageSpec,
): Promise<VersionMap> {
    const { name } =
        typeof spec === "string" ? createSimplePackageSpec(spec) : spec;

    return getVersionMap(name);
}

export default getVersionData;
