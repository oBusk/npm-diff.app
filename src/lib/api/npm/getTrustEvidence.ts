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

// Types for SLSA provenance v1.0 structures
interface SLSAv1Predicate {
    buildDefinition?: {
        externalParameters?: {
            workflow?: {
                ref?: string;
                repository?: string;
                path?: string;
            };
        };
        resolvedDependencies?: Array<{
            uri?: string;
            digest?: {
                gitCommit?: string;
                sha1?: string;
            };
        }>;
    };
}

interface SLSAV1Payload {
    _type?: string;
    subject?: Array<{
        name?: string;
    }>;
    predicateType?: string;
    predicate?: SLSAv1Predicate;
}

interface AttestationBundle {
    predicateType?: string;
    dsseEnvelope?: {
        payload: string;
        payloadType?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface ProvenanceReference {
    url?: string;
    predicateType?: string;
}

// Extended types for manifest with trust-related fields
interface ExtendedNpmUser {
    trustedPublisher?: boolean;
    [key: string]: unknown;
}

interface ExtendedDist {
    attestations?: {
        url?: string;
        provenance?: ProvenanceReference;
        [key: string]: unknown;
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
    const npmUser = manifest._npmUser as unknown as ExtendedNpmUser | undefined;
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
 * Fetch attestation bundle from npm registry
 */
async function fetchAttestationBundle(
    url: string,
): Promise<AttestationBundle[] | null> {
    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json()) as { attestations?: unknown };
        if (
            data.attestations &&
            Array.isArray(data.attestations) &&
            data.attestations.length > 0
        ) {
            return data.attestations as AttestationBundle[];
        }
    } catch (e) {
        console.warn("Failed to fetch attestation bundle", e);
    }
    return null;
}

/**
 * Extract provenance URL from manifest if available
 */
async function getProvenanceUrl(
    manifest: Manifest,
): Promise<string | undefined> {
    const dist = manifest.dist as unknown as ExtendedDist | undefined;
    const attestations = dist?.attestations;
    if (!attestations?.url) {
        return undefined;
    }

    // Fetch the attestation bundle from npm registry
    const bundles = await fetchAttestationBundle(attestations.url);
    if (!bundles) {
        return undefined;
    }

    // Find the SLSA provenance attestation
    const provenanceBundle = bundles.find(
        (bundle) =>
            bundle.dsseEnvelope &&
            (bundle.predicateType === "https://slsa.dev/provenance/v1" ||
                bundle.predicateType?.includes("slsa.dev/provenance")),
    );

    if (!provenanceBundle?.dsseEnvelope?.payload) {
        return undefined;
    }

    try {
        // Decode base64 payload
        const payload = Buffer.from(
            provenanceBundle.dsseEnvelope.payload,
            "base64",
        ).toString("utf-8");
        const predicateObj = JSON.parse(payload) as SLSAV1Payload;

        // Extract from SLSA v1.0 format
        const predicate = predicateObj.predicate;
        if (!predicate?.buildDefinition) {
            return undefined;
        }

        // Get repository URL from external parameters
        const repository =
            predicate.buildDefinition.externalParameters?.workflow?.repository;
        if (!repository) {
            return undefined;
        }

        // Validate it's a GitHub URL (security: only allow github.com as the exact hostname)
        if (!isValidGitHubUrl(repository)) {
            return undefined;
        }

        // Get commit SHA from resolvedDependencies
        const deps = predicate.buildDefinition.resolvedDependencies;
        if (!deps || !Array.isArray(deps) || deps.length === 0) {
            return undefined;
        }

        const commitSha = deps[0]?.digest?.gitCommit;
        if (!commitSha || !/^[a-f0-9]{40}$/i.test(commitSha)) {
            return undefined;
        }

        // Extract owner/repo from GitHub URL
        const repoMatch = repository.match(
            /^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/,
        );
        if (!repoMatch) {
            return undefined;
        }

        return `https://github.com/${repoMatch[1]}/commit/${commitSha}`;
    } catch (e) {
        console.warn("Failed to parse provenance URL", e);
    }

    return undefined;
}

/**
 * Validate that a URL is a proper GitHub repository URL
 * Security: Only allow github.com as the exact hostname (not as part of path or subdomain)
 */
function isValidGitHubUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        // Only allow github.com as the hostname
        return parsed.hostname === "github.com" && parsed.protocol === "https:";
    } catch {
        return false;
    }
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
        evidence === "provenance"
            ? await getProvenanceUrl(manifest)
            : undefined;

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
