import semver from "semver";

export interface Comparison {
    from: string;
    to: string;
    type: "major" | "minor" | "patch";
}

interface VersionInfo {
    version: string;
    publishDate: string;
}

/**
 * Generates exactly 10 comparison links for a package, following these rules:
 * - 3 Major bumps: First release of major vs last release of previous major
 * - 3 Minor bumps: First release of minor vs last release of previous minor
 * - 4 Patch bumps: Most recent 4 patches sequentially
 * - If any category has fewer than target, backfill from: Majors > Minors > Patches
 * - Total must be 10 unless package has < 11 versions
 */
export function generateComparisons(
    versions: string[],
    versionMap: Record<string, { time: string }>,
): Comparison[] {
    // Sort versions by semver in descending order (newest first)
    const sortedVersions = versions
        .filter((v) => semver.valid(v))
        .sort((a, b) => semver.rcompare(a, b));

    if (sortedVersions.length < 2) {
        return [];
    }

    const majorBumps = findMajorBumps(sortedVersions);
    const minorBumps = findMinorBumps(sortedVersions);
    const patchBumps = findPatchBumps(sortedVersions);

    // Target counts: 3 majors, 3 minors, 4 patches
    let selectedMajors = majorBumps.slice(0, 3);
    let selectedMinors = minorBumps.slice(0, 3);
    let selectedPatches = patchBumps.slice(0, 4);

    // Backfill logic: Majors > Minors > Patches
    const totalSelected =
        selectedMajors.length + selectedMinors.length + selectedPatches.length;
    const needed = Math.min(10, sortedVersions.length - 1) - totalSelected;

    if (needed > 0) {
        // Try to backfill from majors first
        const extraMajors = majorBumps.slice(3, 3 + needed);
        selectedMajors = [...selectedMajors, ...extraMajors];

        const stillNeeded = needed - extraMajors.length;
        if (stillNeeded > 0) {
            // Then from minors
            const extraMinors = minorBumps.slice(3, 3 + stillNeeded);
            selectedMinors = [...selectedMinors, ...extraMinors];

            const finalNeeded = stillNeeded - extraMinors.length;
            if (finalNeeded > 0) {
                // Finally from patches
                const extraPatches = patchBumps.slice(4, 4 + finalNeeded);
                selectedPatches = [...selectedPatches, ...extraPatches];
            }
        }
    }

    // Combine all comparisons
    const allComparisons = [
        ...selectedMajors,
        ...selectedMinors,
        ...selectedPatches,
    ];

    // Sort by publish date (newest first)
    return allComparisons.sort((a, b) => {
        const timeA = versionMap[a.to]?.time || "";
        const timeB = versionMap[b.to]?.time || "";
        return timeB.localeCompare(timeA);
    });
}

/**
 * Find all major version bumps
 * E.g., 2.0.0 vs 1.9.4 (first of major 2 vs last of major 1)
 */
function findMajorBumps(sortedVersions: string[]): Comparison[] {
    const majorGroups = new Map<number, string[]>();

    // Group versions by major
    for (const version of sortedVersions) {
        const major = semver.major(version);
        if (!majorGroups.has(major)) {
            majorGroups.set(major, []);
        }
        majorGroups.get(major)!.push(version);
    }

    const majors = Array.from(majorGroups.keys()).sort((a, b) => b - a);
    const comparisons: Comparison[] = [];

    for (let i = 0; i < majors.length - 1; i++) {
        const currentMajor = majors[i];
        const previousMajor = majors[i + 1];

        const currentVersions = majorGroups.get(currentMajor)!;
        const previousVersions = majorGroups.get(previousMajor)!;

        // First of current major vs last of previous major
        const firstOfCurrent = currentVersions[currentVersions.length - 1];
        const lastOfPrevious = previousVersions[0];

        comparisons.push({
            from: lastOfPrevious,
            to: firstOfCurrent,
            type: "major",
        });
    }

    return comparisons;
}

/**
 * Find all minor version bumps
 * E.g., 2.1.0 vs 2.0.12 (first of minor 1 vs last of minor 0)
 */
function findMinorBumps(sortedVersions: string[]): Comparison[] {
    const minorGroups = new Map<string, string[]>();

    // Group versions by major.minor
    for (const version of sortedVersions) {
        const key = `${semver.major(version)}.${semver.minor(version)}`;
        if (!minorGroups.has(key)) {
            minorGroups.set(key, []);
        }
        minorGroups.get(key)!.push(version);
    }

    // Sort minor groups by version (newest first)
    const minorKeys = Array.from(minorGroups.keys()).sort((a, b) => {
        const vA = minorGroups.get(a)![0];
        const vB = minorGroups.get(b)![0];
        return semver.rcompare(vA, vB);
    });

    const comparisons: Comparison[] = [];

    for (let i = 0; i < minorKeys.length - 1; i++) {
        const currentKey = minorKeys[i];
        const previousKey = minorKeys[i + 1];

        const currentVersions = minorGroups.get(currentKey)!;
        const previousVersions = minorGroups.get(previousKey)!;

        // Check if they're in the same major version
        const currentMajor = semver.major(currentVersions[0]);
        const previousMajor = semver.major(previousVersions[0]);

        if (currentMajor === previousMajor) {
            // First of current minor vs last of previous minor
            const firstOfCurrent = currentVersions[currentVersions.length - 1];
            const lastOfPrevious = previousVersions[0];

            comparisons.push({
                from: lastOfPrevious,
                to: firstOfCurrent,
                type: "minor",
            });
        }
    }

    return comparisons;
}

/**
 * Find the most recent patch bumps (sequential)
 * E.g., 2.1.4 vs 2.1.3
 */
function findPatchBumps(sortedVersions: string[]): Comparison[] {
    const comparisons: Comparison[] = [];

    // Take consecutive versions (most recent patches)
    for (let i = 0; i < sortedVersions.length - 1 && comparisons.length < 10; i++) {
        const to = sortedVersions[i];
        const from = sortedVersions[i + 1];

        // Only consider it a patch bump if major and minor are the same
        if (
            semver.major(to) === semver.major(from) &&
            semver.minor(to) === semver.minor(from)
        ) {
            comparisons.push({
                from,
                to,
                type: "patch",
            });
        }
    }

    return comparisons;
}
