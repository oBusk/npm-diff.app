import type { Manifest } from "../packument";
import { fetchAttestationBundles } from "./fetchAttestationBundle";
import {
    parseSlsaProvenanceV0_2Predicate,
    SlsaProvenanceV0_2PredicateType,
    type SlsaProvenanceV0_2Statement,
} from "./predicates/slsaProvenanceV0_2";
import {
    parseSlsaProvenancePredicate,
    SlsaProvenancePredicateType,
    type SlsaProvenanceStatement,
} from "./predicates/slsaProvenanceV1";
import { parseDsseEnvelope } from "./protocols/dsse";
import type {
    SigStoreBundleV0_1,
    SigStoreBundleV0_2,
    SigStoreBundleV0_3,
} from "./protocols/sigstore";
import { type SourceInformation } from ".";

type SigStoreBundleWithTlogEntries =
    | SigStoreBundleV0_1
    | SigStoreBundleV0_2
    | SigStoreBundleV0_3;

export function extractPublicLedgerUrl(
    bundle: SigStoreBundleWithTlogEntries,
): string {
    const tlogIndex = bundle.verificationMaterial.tlogEntries[0].logIndex;
    if (tlogIndex == null) {
        throw new Error("No tlog index found in verification material");
    }
    if (Number(tlogIndex).toString() !== tlogIndex.toString()) {
        throw new Error("Invalid tlog index format");
    }
    return `https://search.sigstore.dev/?logIndex=${tlogIndex}`;
}

/**
 * Extract provenance URL from manifest if available
 */

export async function getSourceFromManifest(
    manifest: Manifest,
): Promise<SourceInformation | undefined> {
    const trustedPublisher = manifest._npmUser?.trustedPublisher != null;

    const dist = manifest.dist;
    const attestations = dist?.attestations;
    if (!attestations) {
        return undefined;
    }

    // Fetch the attestation bundle from npm registry
    const bundles = await fetchAttestationBundles(attestations);
    if (!bundles) {
        return undefined;
    }

    const slsaProvenanceV1Bundle = bundles.find(
        (b) => b.predicateType === SlsaProvenancePredicateType,
    );
    if (slsaProvenanceV1Bundle) {
        const publicLedger = extractPublicLedgerUrl(
            slsaProvenanceV1Bundle.bundle,
        );

        const provenanceStatement = parseDsseEnvelope<SlsaProvenanceStatement>(
            slsaProvenanceV1Bundle.bundle.dsseEnvelope,
        );

        return {
            trustedPublisher,
            ...parseSlsaProvenancePredicate(provenanceStatement.predicate),
            publicLedger,
        };
    }
    const slsaProvenanceV0_2Bundle = bundles.find(
        (b) => b.predicateType === SlsaProvenanceV0_2PredicateType,
    );
    if (slsaProvenanceV0_2Bundle) {
        const publicLedger = extractPublicLedgerUrl(
            slsaProvenanceV0_2Bundle.bundle,
        );

        const provenanceStatement =
            parseDsseEnvelope<SlsaProvenanceV0_2Statement>(
                slsaProvenanceV0_2Bundle.bundle.dsseEnvelope,
            );

        return {
            trustedPublisher,
            ...parseSlsaProvenanceV0_2Predicate(provenanceStatement.predicate),
            publicLedger,
        };
    }

    throw new Error("No supported SLSA provenance bundle found");
}
