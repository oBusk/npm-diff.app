import { unstable_cache } from "next/cache";
import { cache } from "react";
import packument from "^/lib/api/npm/packument";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";

export default async function publishDate({
    name,
    version,
}: SimplePackageSpec) {
    const time = await times(name);
    return time[version];
}

// Cache all timestamps, no need to cache each separate timestamp.
const times =
    // Yeah I'm not sure, but seems like cache around unstable_cache is needed?
    cache(
        unstable_cache(async (packageName: string) => {
            const { time } = await packument(packageName);
            return time;
        }),
    );
