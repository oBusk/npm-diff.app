import type { Version } from "./Version";

export default function buildVersions(
    versionTimes: Record<string, string>,
    distTags: Record<string, string>,
): Version[] {
    const tagsByVersion = new Map<string, string[]>();

    for (const [tag, version] of Object.entries(distTags)) {
        const existing = tagsByVersion.get(version);
        if (existing) {
            existing.push(tag);
        } else {
            tagsByVersion.set(version, [tag]);
        }
    }

    return Object.entries(versionTimes).map(([version, time]) => {
        const tags = tagsByVersion.get(version);
        return tags ? { version, time, tags } : { version, time };
    });
}
