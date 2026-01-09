import { cacheLife } from "next/cache";
import type { Manifest } from "pacote";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import packument from "./packument";

export type TrustEvidence = "provenance" | "trustedPublisher" | undefined;

export interface TrustInfo {
    evidence: TrustEvidence;
    provenanceUrl?: string;
}

/**
 * Get trust evidence for a specific package version from the packument.
 * Based on pnpm's getTrustEvidence function:
 * https://github.com/pnpm/pnpm/blob/main/resolving/npm-resolver/src/trustChecks.ts
 */
export function getTrustEvidenceFromManifest(
    manifest: Manifest,
): TrustEvidence {
    // Check for trustedPublisher on _npmUser
    // The trustedPublisher property is not in the standard Person type but may be present
    if ((manifest._npmUser as any)?.trustedPublisher) {
        return "trustedPublisher";
    }
    // Check for provenance attestations in dist
    // The attestations property is not in the standard PackageDist type but may be present
    if ((manifest.dist as any)?.attestations?.provenance) {
        return "provenance";
    }
    return undefined;
}

/**
 * Extract provenance URL from manifest if available
 */
function getProvenanceUrl(manifest: Manifest): string | undefined {
    // The attestations property is not in the standard PackageDist type but may be present
    const provenance = (manifest.dist as any)?.attestations?.provenance;
    if (!provenance) {
        return undefined;
    }

    // Try to extract the source repository URL from provenance
    // The provenance object typically contains a predicateType and subject
    // We need to look for the source repository in the provenance data
    try {
        if (typeof provenance === "object" && provenance.predicateType) {
            // Provenance attestations follow SLSA format
            // The source repo info is in the build details
            const buildConfig = provenance.predicate?.buildConfig;
            if (buildConfig?.source?.repository?.url) {
                const repoUrl = buildConfig.source.repository.url;
                const commitSha = buildConfig.source.digest?.sha1;

                if (commitSha) {
                    // Convert git URL to GitHub web URL
                    const match = repoUrl.match(
                        /github\.com[:/]([^/]+\/[^/.]+)/,
                    );
                    if (match) {
                        return `https://github.com/${match[1]}/commit/${commitSha}`;
                    }
                }
            }
        }
    } catch (e) {
        console.warn("Failed to parse provenance URL", e);
    }

    return undefined;
}

/**
 * Separate function that takes only packagename and version for better caching.
 */
async function getTrustInfoForVersion(
    packageName: string,
    version: string,
): Promise<TrustInfo> {
    "use cache";

    cacheLife("hours");

    const pack = await packument(packageName, {
        // Response is too large to cache in Next's Data Cache; always fetch
        cache: "no-store",
    });

    const manifest = pack.versions[version];
    if (!manifest) {
        return { evidence: undefined };
    }

    const evidence = getTrustEvidenceFromManifest(manifest);
    const provenanceUrl =
        evidence === "provenance" ? getProvenanceUrl(manifest) : undefined;

    return { evidence, provenanceUrl };
}

/**
 * Get trust information for a package spec
 */
export default async function getTrustEvidence(
    spec: string | SimplePackageSpec,
): Promise<TrustInfo> {
    const { name, version } =
        typeof spec === "string" ? createSimplePackageSpec(spec) : spec;

    if (!name || !version) {
        return { evidence: undefined };
    }

    return getTrustInfoForVersion(name, version);
}
