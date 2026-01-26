import Link from "next/link";
import semver from "semver";
import BorderBox from "^/components/ui/BorderBox";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import type { Comparison } from "^/lib/utils/generateComparisons";

export interface ComparisonListProps {
    packageName: string;
    comparisons: Comparison[];
}

/**
 * Returns which part of the semver changed: 0 (major), 1 (minor), or 2 (patch)
 */
function getChangedPart(from: string, to: string): number {
    const fromParsed = semver.parse(from);
    const toParsed = semver.parse(to);

    if (!fromParsed || !toParsed) {
        return -1;
    }

    if (fromParsed.major !== toParsed.major) {
        return 0; // major changed
    }
    if (fromParsed.minor !== toParsed.minor) {
        return 1; // minor changed
    }
    if (fromParsed.patch !== toParsed.patch) {
        return 2; // patch changed
    }

    return -1;
}

/**
 * Highlights the specific semver digit that changed
 */
function VersionWithHighlight({
    version,
    highlightIndex,
}: {
    version: string;
    highlightIndex: number;
}) {
    const parsed = semver.parse(version);
    if (!parsed) {
        return <span className="font-mono">{version}</span>;
    }

    const parts = [parsed.major, parsed.minor, parsed.patch];

    return (
        <span className="font-mono">
            {parts.map((part, index) => (
                <span key={index}>
                    {index === highlightIndex ? (
                        <span className="rounded bg-blue-500/20 px-1 font-bold">
                            {part}
                        </span>
                    ) : (
                        <span>{part}</span>
                    )}
                    {index < 2 && "."}
                </span>
            ))}
        </span>
    );
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
                Version Comparisons
            </Heading>

            <Stack direction="v" gap={2}>
                {comparisons.map((comparison, index) => {
                    const changedPart = getChangedPart(
                        comparison.from,
                        comparison.to,
                    );
                    const url = `/${packageName}@${comparison.from}...${packageName}@${comparison.to}`;

                    return (
                        <Link
                            key={index}
                            href={url}
                            className="flex items-center justify-between rounded-md border border-input p-3 transition-colors hover:border-blue-500/50 hover:bg-blue-500/5"
                            prefetch={false}
                        >
                            <div className="flex items-center gap-2">
                                <VersionWithHighlight
                                    version={comparison.from}
                                    highlightIndex={changedPart}
                                />
                                <span className="text-muted-foreground">→</span>
                                <VersionWithHighlight
                                    version={comparison.to}
                                    highlightIndex={changedPart}
                                />
                            </div>
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
