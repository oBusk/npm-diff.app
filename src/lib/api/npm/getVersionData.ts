import { unstable_cache } from "next/cache";
import { cache } from "react";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
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

async function getVersionDataInner(
    spec: string | SimplePackageSpec,
): Promise<VersionMap> {
    const specString =
        typeof spec === "string" ? spec : simplePackageSpecToString(spec);

    const {
        time,
        "dist-tags": tags,
        versions,
    } = await packument(specString, {
        // Response is too large to cache in Next's Data Cache; always fetch
        cache: "no-store",
    });

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

const getVersionData =
    // Cache for request de-dupe
    cache(
        // unstable cache to cache between requests (5 minute TTL)
        unstable_cache(getVersionDataInner, ["versionData"], {
            revalidate: 300,
        }),
    );

export default getVersionData;
