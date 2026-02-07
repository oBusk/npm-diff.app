import Link from "next/link";
import BorderBox from "^/components/ui/BorderBox";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import type { Comparison } from "^/lib/utils/generateComparisons";
import specsToDiff from "^/lib/utils/specsToDiff";
import PackageNamePrefix from "./PackageNamePrefix";
import VersionWithHighlight from "./VersionWithHighlight";

export interface ComparisonListProps {
    packageName: string;
    comparisons: Comparison[];
}

/**
 * Returns which part of the semver changed based on comparison type
 */
function getHighlightIndex(type: "major" | "minor" | "patch"): number {
    switch (type) {
        case "major":
            return 0;
        case "minor":
            return 1;
        case "patch":
            return 2;
    }
}

/**
 * Right column showing the list of comparisons
 */
export default function ComparisonList({
    packageName,
    comparisons,
}: ComparisonListProps) {
    if (comparisons.length === 0) {
        return (
            <BorderBox>
                <p className="text-sm text-muted-foreground">
                    No comparisons available for this package.
                </p>
            </BorderBox>
        );
    }

    return (
        <BorderBox className="flex flex-col gap-4">
            <Heading h={2} className="text-2xl">
                Suggested Diffs
            </Heading>

            <Stack direction="v" gap={2}>
                {comparisons.map((comparison) => {
                    const highlightIndex = getHighlightIndex(comparison.type);
                    const fromSpec = `${packageName}@${comparison.from}`;
                    const toSpec = `${packageName}@${comparison.to}`;
                    const diffPath = specsToDiff([fromSpec, toSpec]);

                    return (
                        <Link
                            key={`${comparison.from}-${comparison.to}`}
                            href={`/${diffPath}`}
                            className="flex items-center justify-between rounded-md border border-input p-3 transition-colors hover:border-blue-500/50 hover:bg-blue-500/5"
                            prefetch={false}
                            aria-label={`Compare ${fromSpec}...${toSpec} (${comparison.type} version change)`}
                        >
                            <span className="font-mono">
                                <PackageNamePrefix packageName={packageName} />
                                <VersionWithHighlight
                                    version={comparison.from}
                                    highlightIndex={highlightIndex}
                                />
                                <span className="text-muted-foreground">
                                    ...
                                </span>
                                <PackageNamePrefix packageName={packageName} />
                                <VersionWithHighlight
                                    version={comparison.to}
                                    highlightIndex={highlightIndex}
                                />
                            </span>
                            <span className="text-xs capitalize text-muted-foreground">
                                {comparison.type}
                            </span>
                        </Link>
                    );
                })}
            </Stack>
        </BorderBox>
    );
}
