import semver from "semver";

export interface VersionWithHighlightProps {
    version: string;
    highlightIndex: number;
}

/**
 * Highlights the specific semver digit that changed
 */
export default function VersionWithHighlight({
    version,
    highlightIndex,
}: VersionWithHighlightProps) {
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
