"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type Version } from "^/app/api/-/versions/types";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";

interface VersionSelectorProps {
    /** The current package spec */
    currentSpec: SimplePackageSpec;
    /** The other package spec (to keep in the diff) */
    otherSpec: SimplePackageSpec;
    /** Whether this is the 'a' (left/from) or 'b' (right/to) side */
    side: "a" | "b";
    /** Class name for the select element */
    className?: string;
}

export default function VersionSelector({
    currentSpec,
    otherSpec,
    side,
    className,
}: VersionSelectorProps) {
    const router = useRouter();
    const [versions, setVersions] = useState<Version[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `/api/-/versions?package=${encodeURIComponent(currentSpec.name)}`,
                );
                if (response.ok) {
                    const data: Version[] = await response.json();
                    setVersions(data);
                }
            } catch (error) {
                console.error("Failed to fetch versions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVersions();
    }, [currentSpec.name]);

    const handleVersionChange = (newVersion: string) => {
        if (newVersion === currentSpec.version) {
            return; // No change
        }

        // Build the new URL based on which side we're updating
        const newA =
            side === "a"
                ? `${currentSpec.name}@${newVersion}`
                : `${otherSpec.name}@${otherSpec.version}`;
        const newB =
            side === "b"
                ? `${currentSpec.name}@${newVersion}`
                : `${otherSpec.name}@${otherSpec.version}`;

        // Navigate to the new diff URL
        router.push(`/${newA}...${newB}`);
    };

    if (isLoading) {
        return <span className={className}>{currentSpec.version}</span>;
    }

    // Sort versions in reverse chronological order (newest first)
    const sortedVersions = [...versions].sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    return (
        <select
            value={currentSpec.version}
            onChange={(e) => handleVersionChange(e.target.value)}
            className={className}
            aria-label={`Select version for ${currentSpec.name}`}
        >
            {sortedVersions.map((version) => (
                <option key={version.version} value={version.version}>
                    {version.version}
                    {version.tags && version.tags.length > 0
                        ? ` (${version.tags.join(", ")})`
                        : ""}
                </option>
            ))}
        </select>
    );
}
