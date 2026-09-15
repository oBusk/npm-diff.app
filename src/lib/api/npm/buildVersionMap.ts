import type { VersionMap } from "./VersionData";

function buildVersionMap(
    versionTimes: Record<string, string>,
    distTags: Record<string, string>,
): VersionMap {
    const versionData: VersionMap = {};

    for (const [version, time] of Object.entries(versionTimes)) {
        versionData[version] = { time };
    }

    for (const [tag, version] of Object.entries(distTags)) {
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

export default buildVersionMap;
