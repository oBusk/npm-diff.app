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

// Types for provenance attestation structures
interface ProvenanceAttestation {
    dsseEnvelope?: {
        payload: string;
        [key: string]: unknown;
    };
    predicate?: unknown;
    [key: string]: unknown;
}

interface SLSAPredicate {
    buildDefinition?: {
        externalParameters?: {
            source?: {
                repository?: string;
                ref?: string;
            };
        };
    };
    materials?: Array<{
        uri?: string;
        digest?: {
            sha1?: string;
        };
    }>;
}

interface ProvenancePayload {
    subject?: Array<{
        name?: string;
    }>;
    predicate?: SLSAPredicate;
}

// Extended types for manifest with trust-related fields
interface ExtendedNpmUser {
    trustedPublisher?: boolean;
    [key: string]: unknown;
}

interface ExtendedDist {
    attestations?: {
        provenance?: ProvenanceAttestation;
    };
    [key: string]: unknown;
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
    const npmUser = manifest._npmUser as unknown as
        | ExtendedNpmUser
        | undefined;
    if (npmUser?.trustedPublisher) {
        return "trustedPublisher";
    }
    // Check for provenance attestations in dist
    const dist = manifest.dist as unknown as ExtendedDist | undefined;
    if (dist?.attestations?.provenance) {
        return "provenance";
    }
    return undefined;
}

/**
 * Extract provenance URL from manifest if available
 */
function getProvenanceUrl(manifest: Manifest): string | undefined {
    // The attestations property is not in the standard PackageDist type but may be present
    const dist = manifest.dist as unknown as ExtendedDist | undefined;
    const attestations = dist?.attestations;
    if (!attestations) {
        return undefined;
    }

    // Provenance is typically the first attestation with SLSA predicate type
    const provenance = attestations.provenance;
    if (!provenance) {
        return undefined;
    }

    // Try to extract the source repository URL from provenance
    // Based on SLSA provenance v0.2 and v1.0 format
    try {
        // The provenance attestation contains a bundle with a dsseEnvelope
        // which has a payload that needs to be decoded
        let predicateObj: ProvenancePayload;

        // Check if provenance is already an object or needs to be parsed
        if (typeof provenance === "string") {
            predicateObj = JSON.parse(provenance) as ProvenancePayload;
        } else if (provenance.dsseEnvelope?.payload) {
            // Decode base64 payload
            const payload = Buffer.from(
                provenance.dsseEnvelope.payload,
                "base64",
            ).toString("utf-8");
            predicateObj = JSON.parse(payload) as ProvenancePayload;
        } else {
            predicateObj = provenance as ProvenancePayload;
        }

        // Extract source commit from predicate
        // SLSA v0.2 format: predicate.materials[].uri
        // SLSA v1.0 format: predicate.buildDefinition.externalParameters.source
        const predicate =
            predicateObj.predicate ||
            (predicateObj as unknown as SLSAPredicate);

        // Try SLSA v1.0 format first
        if (predicate.buildDefinition?.externalParameters?.source) {
            const source = predicate.buildDefinition.externalParameters.source;
            if (source.repository && source.ref) {
                return extractGitHubUrl(source.repository, source.ref);
            }
        }

        // Try SLSA v0.2 format
        if (Array.isArray(predicate.materials)) {
            for (const material of predicate.materials) {
                if (
                    material.uri &&
                    material.uri.includes("github.com") &&
                    material.digest?.sha1
                ) {
                    return extractGitHubUrl(material.uri, material.digest.sha1);
                }
            }
        }

        // Fallback: try to find any GitHub reference in the subject
        if (predicateObj.subject && Array.isArray(predicateObj.subject)) {
            for (const subject of predicateObj.subject) {
                if (subject.name && subject.name.includes("github.com")) {
                    const match = subject.name.match(
                        /github\.com[:/]([^/]+\/[^/@]+)(?:@|\/tree\/)([a-f0-9]{40})/,
                    );
                    if (match) {
                        return `https://github.com/${match[1]}/commit/${match[2]}`;
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
 * Extract a GitHub commit URL from a repository URL and commit reference
 */
function extractGitHubUrl(
    repoUrl: string,
    commitRef: string,
): string | undefined {
    // Handle various GitHub URL formats
    const match = repoUrl.match(/github\.com[:/]([^/]+\/[^/.@]+?)(?:\.git)?$/);
    if (!match) {
        return undefined;
    }

    const repo = match[1];

    // Extract commit SHA from ref (could be refs/heads/main or just a SHA)
    const commitSha = commitRef;
    if (commitRef.startsWith("refs/")) {
        // This is a branch ref, not a commit SHA
        // We can't create a direct commit URL without the actual SHA
        return undefined;
    }

    // Validate it looks like a SHA (40 hex characters)
    if (/^[a-f0-9]{40}$/i.test(commitSha)) {
        return `https://github.com/${repo}/commit/${commitSha}`;
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
