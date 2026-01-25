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

    // Group versions by major
    const versionsByMajor = new Map<number, Version[]>();
    for (const version of versions) {
        const maj = major(version.version);
        if (!versionsByMajor.has(maj)) {
            versionsByMajor.set(maj, []);
        }
        versionsByMajor.get(maj)!.push(version);
    }

    // For each major version, find minor bumps
    for (const [, versionsInMajor] of versionsByMajor) {
        // Group by minor within this major
        const versionsByMinor = new Map<number, Version[]>();
        for (const version of versionsInMajor) {
            const min = minor(version.version);
            if (!versionsByMinor.has(min)) {
                versionsByMinor.set(min, []);
            }
            versionsByMinor.get(min)!.push(version);
        }

        const sortedMinors = Array.from(versionsByMinor.keys()).sort(
            (a, b) => b - a,
        );

        // Create diffs from last version of minor X to first version (X.0) of minor X+1
        for (let i = 0; i < sortedMinors.length - 1; i++) {
            const currentMinor = sortedMinors[i];
            const previousMinor = sortedMinors[i + 1];

            const currentMinorVersions = versionsByMinor.get(currentMinor)!;
            const previousMinorVersions = versionsByMinor.get(previousMinor)!;

            // Get first version of current minor (patch = 0, or lowest if .0 doesn't exist)
            const dotZero = currentMinorVersions.find(
                (v) => patch(v.version) === 0,
            );
            const firstOfCurrent =
                dotZero ||
                currentMinorVersions.sort((a, b) =>
                    rcompare(b.version, a.version),
                )[currentMinorVersions.length - 1];

            // Get last version of previous minor (highest patch)
            const lastOfPrevious = previousMinorVersions.sort((a, b) =>
                rcompare(a.version, b.version),
            )[0];

            const key = `${lastOfPrevious.version}...${firstOfCurrent.version}`;
            if (!seen.has(key)) {
                seen.add(key);
                links.push({
                    from: `${packageName}@${lastOfPrevious.version}`,
                    to: `${packageName}@${firstOfCurrent.version}`,
                    type: "minor",
                    label: `${lastOfPrevious.version} → ${firstOfCurrent.version}`,
                });
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

    // Group versions by major
    const versionsByMajor = new Map<number, Version[]>();
    for (const version of versions) {
        const maj = major(version.version);
        if (!versionsByMajor.has(maj)) {
            versionsByMajor.set(maj, []);
        }
        versionsByMajor.get(maj)!.push(version);
    }

    const sortedMajors = Array.from(versionsByMajor.keys()).sort(
        (a, b) => b - a,
    );

    // Create diffs from last version of major X to first version (X.0.0) of major X+1
    for (let i = 0; i < sortedMajors.length - 1; i++) {
        const currentMajor = sortedMajors[i];
        const previousMajor = sortedMajors[i + 1];

        const currentMajorVersions = versionsByMajor.get(currentMajor)!;
        const previousMajorVersions = versionsByMajor.get(previousMajor)!;

        // Get first version of current major (X.0.0, or lowest if .0.0 doesn't exist)
        const dotZeroDotZero = currentMajorVersions.find(
            (v) => minor(v.version) === 0 && patch(v.version) === 0,
        );
        const firstOfCurrent =
            dotZeroDotZero ||
            currentMajorVersions.sort((a, b) => rcompare(b.version, a.version))[
                currentMajorVersions.length - 1
            ];

        // Get last version of previous major (highest version)
        const lastOfPrevious = previousMajorVersions.sort((a, b) =>
            rcompare(a.version, b.version),
        )[0];

        const key = `${lastOfPrevious.version}...${firstOfCurrent.version}`;
        if (!seen.has(key)) {
            seen.add(key);
            links.push({
                from: `${packageName}@${lastOfPrevious.version}`,
                to: `${packageName}@${firstOfCurrent.version}`,
                type: "major",
                label: `${lastOfPrevious.version} → ${firstOfCurrent.version}`,
            });
        }
    }

    return links;
}
