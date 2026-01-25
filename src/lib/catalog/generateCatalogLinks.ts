import { major, minor, patch, rcompare } from "semver";
import { type Version } from "^/app/api/-/versions/types";

export interface CatalogLink {
    /** The "from" spec */
    from: string;
    /** The "to" spec */
    to: string;
    /** The type of diff - patch, minor, or major */
    type: "patch" | "minor" | "major";
    /** Human readable label for the diff */
    label: string;
}

/**
 * Generate catalog links for a package showing sensible diffs
 * Aims to generate ~16 links by showing:
 * - Last 5 patch versions (each compared with previous patch)
 * - Last 5 minor versions (each compared with previous minor)
 * - Last 5 major versions (each compared with previous major)
 */
export function generateCatalogLinks(
    packageName: string,
    versions: Version[],
): CatalogLink[] {
    // Filter out prerelease versions
    const stableVersions = versions
        .filter((v) => !v.version.includes("-"))
        .sort((a, b) => rcompare(a.version, b.version));

    if (stableVersions.length === 0) {
        return [];
    }

    const links: CatalogLink[] = [];

    // Generate patch diffs (versions that differ only in patch)
    const patchLinks = generatePatchLinks(packageName, stableVersions);
    links.push(...patchLinks.slice(0, 5));

    // Generate minor diffs (versions that differ in minor, same major)
    const minorLinks = generateMinorLinks(packageName, stableVersions);
    links.push(...minorLinks.slice(0, 5));

    // Generate major diffs (versions that differ in major)
    const majorLinks = generateMajorLinks(packageName, stableVersions);
    links.push(...majorLinks.slice(0, 5));

    // If we don't have 16 links yet, add more from any category
    if (links.length < 16) {
        const allLinks = [
            ...patchLinks.slice(5),
            ...minorLinks.slice(5),
            ...majorLinks.slice(5),
        ];
        links.push(...allLinks.slice(0, 16 - links.length));
    }

    return links;
}

function generatePatchLinks(
    packageName: string,
    versions: Version[],
): CatalogLink[] {
    const links: CatalogLink[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < versions.length - 1; i++) {
        const current = versions[i];
        const next = versions[i + 1];

        // Check if they differ only in patch version
        if (
            major(current.version) === major(next.version) &&
            minor(current.version) === minor(next.version) &&
            patch(current.version) !== patch(next.version)
        ) {
            const key = `${next.version}...${current.version}`;
            if (!seen.has(key)) {
                seen.add(key);
                links.push({
                    from: `${packageName}@${next.version}`,
                    to: `${packageName}@${current.version}`,
                    type: "patch",
                    label: `${next.version} → ${current.version}`,
                });
            }
        }
    }

    return links;
}

function generateMinorLinks(
    packageName: string,
    versions: Version[],
): CatalogLink[] {
    const links: CatalogLink[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < versions.length - 1; i++) {
        const current = versions[i];

        // Find the previous minor version (same major, different minor)
        for (let j = i + 1; j < versions.length; j++) {
            const candidate = versions[j];

            if (
                major(current.version) === major(candidate.version) &&
                minor(current.version) !== minor(candidate.version)
            ) {
                const key = `${candidate.version}...${current.version}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    links.push({
                        from: `${packageName}@${candidate.version}`,
                        to: `${packageName}@${current.version}`,
                        type: "minor",
                        label: `${candidate.version} → ${current.version}`,
                    });
                }
                break;
            }
        }
    }

    return links;
}

function generateMajorLinks(
    packageName: string,
    versions: Version[],
): CatalogLink[] {
    const links: CatalogLink[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < versions.length - 1; i++) {
        const current = versions[i];

        // Find the previous major version
        for (let j = i + 1; j < versions.length; j++) {
            const candidate = versions[j];

            if (major(current.version) !== major(candidate.version)) {
                const key = `${candidate.version}...${current.version}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    links.push({
                        from: `${packageName}@${candidate.version}`,
                        to: `${packageName}@${current.version}`,
                        type: "major",
                        label: `${candidate.version} → ${current.version}`,
                    });
                }
                break;
            }
        }
    }

    return links;
}
