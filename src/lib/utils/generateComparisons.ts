import semver from "semver";

export interface Comparison {
    from: string;
    to: string;
    type: "major" | "minor" | "patch";
}

/**
 * Generates exactly 10 comparison links for a package, following these rules:
 * - 3 Major bumps: First release of major vs last release of previous major
 * - 3 Minor bumps: First release of minor vs last release of previous minor
 * - 4 Patch bumps: Most recent 4 patches sequentially
 * - If any category has fewer than target, backfill from: Majors > Minors > Patches
 * - Total must be 10 unless package has < 11 versions
 */
export function generateComparisons(versions: string[]): Comparison[] {
    // Filter out invalid versions and prereleases
    const validVersions = versions.filter(
        (v) => semver.valid(v) && !semver.prerelease(v),
    );

    // Sort versions by semver in descending order (newest first)
    const sortedVersions = validVersions.sort((a, b) => semver.rcompare(a, b));

    if (sortedVersions.length < 2) {
        return [];
    }

    // Find all bumps in a single pass
    const bumps = findAllBumps(sortedVersions);

    // Target counts: 3 majors, 3 minors, 4 patches
    let selectedMajors = bumps.major.slice(0, 3);
    let selectedMinors = bumps.minor.slice(0, 3);
    let selectedPatches = bumps.patch.slice(0, 4);

    // Backfill logic: Majors > Minors > Patches
    const totalSelected =
        selectedMajors.length + selectedMinors.length + selectedPatches.length;
    const needed = Math.min(10, sortedVersions.length - 1) - totalSelected;

    if (needed > 0) {
        // Try to backfill from majors first
        const extraMajors = bumps.major.slice(3, 3 + needed);
        selectedMajors = [...selectedMajors, ...extraMajors];

        const stillNeeded = needed - extraMajors.length;
        if (stillNeeded > 0) {
            // Then from minors
            const extraMinors = bumps.minor.slice(3, 3 + stillNeeded);
            selectedMinors = [...selectedMinors, ...extraMinors];

            const finalNeeded = stillNeeded - extraMinors.length;
            if (finalNeeded > 0) {
                // Finally from patches
                const extraPatches = bumps.patch.slice(4, 4 + finalNeeded);
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

    // Sort by from version (newest first)
    return allComparisons.sort((a, b) => semver.rcompare(a.from, b.from));
}

/**
 * Find all bumps (major, minor, patch) in a single pass through versions
 */
function findAllBumps(sortedVersions: string[]): {
    major: Comparison[];
    minor: Comparison[];
    patch: Comparison[];
} {
    const majorBumps: Comparison[] = [];
    const minorBumps: Comparison[] = [];
    const patchBumps: Comparison[] = [];

    // Group versions by major and minor
    const majorGroups = new Map<number, string[]>();
    const minorGroups = new Map<string, string[]>();

    for (const version of sortedVersions) {
        const major = semver.major(version);
        const minor = semver.minor(version);
        const minorKey = `${major}.${minor}`;

        if (!majorGroups.has(major)) {
            majorGroups.set(major, []);
        }
        majorGroups.get(major)!.push(version);

        if (!minorGroups.has(minorKey)) {
            minorGroups.set(minorKey, []);
        }
        minorGroups.get(minorKey)!.push(version);
    }

    // Find major bumps: first release of major vs last release of previous major
    const majors = Array.from(majorGroups.keys()).sort((a, b) => b - a);
    for (let i = 0; i < majors.length - 1; i++) {
        const currentMajor = majors[i];
        const previousMajor = majors[i + 1];

        const currentVersions = majorGroups.get(currentMajor)!;
        const previousVersions = majorGroups.get(previousMajor)!;

        // First of current (last in sorted array) vs last of previous (first in sorted array)
        const firstOfCurrent = currentVersions[currentVersions.length - 1];
        const lastOfPrevious = previousVersions[0];

        majorBumps.push({
            from: lastOfPrevious,
            to: firstOfCurrent,
            type: "major",
        });
    }

    // Find minor bumps: first release of minor vs last release of previous minor (within same major)
    const minorKeys = Array.from(minorGroups.keys()).sort((a, b) => {
        const [aMajor, aMinor] = a.split(".").map(Number);
        const [bMajor, bMinor] = b.split(".").map(Number);
        if (aMajor !== bMajor) return bMajor - aMajor;
        return bMinor - aMinor;
    });

    for (let i = 0; i < minorKeys.length - 1; i++) {
        const currentKey = minorKeys[i];
        const nextKey = minorKeys[i + 1];

        const [currentMajor, currentMinor] = currentKey.split(".").map(Number);
        const [nextMajor, nextMinor] = nextKey.split(".").map(Number);

        // Only compare if same major and sequential minors
        if (currentMajor === nextMajor && currentMinor === nextMinor + 1) {
            const currentVersions = minorGroups.get(currentKey)!;
            const nextVersions = minorGroups.get(nextKey)!;

            // First of current (last in sorted array) vs last of next (first in sorted array)
            const firstOfCurrent = currentVersions[currentVersions.length - 1];
            const lastOfPrevious = nextVersions[0];

            minorBumps.push({
                from: lastOfPrevious,
                to: firstOfCurrent,
                type: "minor",
            });
        }
    }

    // Find patch bumps: most recent sequential patches
    for (let i = 0; i < sortedVersions.length - 1; i++) {
        const to = sortedVersions[i];
        const from = sortedVersions[i + 1];

        const toMajor = semver.major(to);
        const toMinor = semver.minor(to);
        const toPatch = semver.patch(to);

        const fromMajor = semver.major(from);
        const fromMinor = semver.minor(from);
        const fromPatch = semver.patch(from);

        // Check if it's a sequential patch bump
        if (
            toMajor === fromMajor &&
            toMinor === fromMinor &&
            toPatch === fromPatch + 1
        ) {
            patchBumps.push({
                from,
                to,
                type: "patch",
            });
        }
    }

    return {
        major: majorBumps,
        minor: minorBumps,
        patch: patchBumps,
    };
}
