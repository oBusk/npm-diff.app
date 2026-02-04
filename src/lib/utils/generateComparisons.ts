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
export function generateComparisons(
    versions: string[],
    _versionMap: Record<string, { time: string }>,
): Comparison[] {
    // Filter out invalid versions and prereleases
    const validVersions = versions.filter((v) => {
        if (!semver.valid(v)) return false;
        // Filter out prerelease versions (like 19.3.0-canary-xxx)
        return !semver.prerelease(v);
    });

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

    // Sort by semver version (newest first)
    return allComparisons.sort((a, b) => semver.rcompare(a.to, b.to));
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

    // Track last seen version for each major.minor
    const lastInMajor = new Map<number, string>();
    const lastInMinor = new Map<string, string>();

    for (let i = sortedVersions.length - 1; i >= 0; i--) {
        const current = sortedVersions[i];
        const currentMajor = semver.major(current);
        const currentMinor = semver.minor(current);
        const currentPatch = semver.patch(current);
        const minorKey = `${currentMajor}.${currentMinor}`;

        // Check for major bump
        const prevMajorLast = lastInMajor.get(currentMajor - 1);
        if (prevMajorLast) {
            majorBumps.push({
                from: prevMajorLast,
                to: current,
                type: "major",
            });
        }

        // Check for minor bump (within same major)
        const prevMinorKey = `${currentMajor}.${currentMinor - 1}`;
        const prevMinorLast = lastInMinor.get(prevMinorKey);
        if (prevMinorLast) {
            minorBumps.push({
                from: prevMinorLast,
                to: current,
                type: "minor",
            });
        }

        // Check for patch bump (sequential versions in same minor)
        if (i > 0) {
            const next = sortedVersions[i - 1];
            const nextMajor = semver.major(next);
            const nextMinor = semver.minor(next);
            const nextPatch = semver.patch(next);

            if (
                currentMajor === nextMajor &&
                currentMinor === nextMinor &&
                currentPatch === nextPatch - 1
            ) {
                patchBumps.push({
                    from: current,
                    to: next,
                    type: "patch",
                });
            }
        }

        // Update tracking
        lastInMajor.set(currentMajor, current);
        lastInMinor.set(minorKey, current);
    }

    return {
        major: majorBumps.reverse(), // Reverse to get newest first
        minor: minorBumps.reverse(),
        patch: patchBumps.reverse(),
    };
}
