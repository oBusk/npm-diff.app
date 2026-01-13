import { parseDsseEnvelope } from "./dsse";
import {
    type NpmAttestationPublishBundle,
    NpmPublishPredicateType,
    type NpmPublishStatement,
} from "./predicates/npmPublish";
import {
    type SlsaProvenanceBundle,
    SlsaProvenancePredicateType,
    type SlsaProvenanceStatement,
} from "./predicates/slsaProvenance";
import type { SigStoreBundleV0_2, SigStoreBundleV0_3 } from "./sigstore";

/**
 * What npm registry returns for attestations (as of december 2025)
 *
 * Wraps an extra layer around {@link SigStoreBundleV0_2}/{@link SigStoreBundleV0_3}
 * and includes `predicateType` to identify the type of attestation.
 */
export interface AttestationBundle<
    T extends string = string,
    B extends SigStoreBundleV0_2 | SigStoreBundleV0_3 =
        | SigStoreBundleV0_2
        | SigStoreBundleV0_3,
> {
    predicateType: T;
    bundle: B;
    signedAccessSignatureUrl: string;
}

/**
 * Takes the "Attestation Bundles" that npm registry returns, verifies that it's
 * an expected type, and parses the encoded data inside the DSSE envelope.
 *
 * @throws {Error} If the attestation bundle type is not one of the known types.
 */
export function parseAttestationBundle(
    attestationBundle: NpmAttestationPublishBundle,
): NpmPublishStatement;
export function parseAttestationBundle(
    attestationBundle: SlsaProvenanceBundle,
): SlsaProvenanceStatement;
export function parseAttestationBundle(
    attBun: NpmAttestationPublishBundle | SlsaProvenanceBundle,
) {
    if (attBun.predicateType === NpmPublishPredicateType) {
        const result: NpmPublishStatement = parseDsseEnvelope(
            attBun.bundle.dsseEnvelope,
        );

        return result;
    } else if (attBun.predicateType === SlsaProvenancePredicateType) {
        const result: SlsaProvenanceStatement = parseDsseEnvelope(
            attBun.bundle.dsseEnvelope,
        );

        return result;
    } else {
        throw new Error("Unknown attestation bundle type");
    }
}
