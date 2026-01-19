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
    type SlsaProvenanceV0_2Bundle,
    SlsaProvenanceV0_2PredicateType,
    type SlsaProvenanceV0_2Statement,
} from "./predicates/slsaProvenance";
import type {
    SigStoreBundleV0_1,
    SigStoreBundleV0_2,
    SigStoreBundleV0_3,
} from "./sigstore";

/**
 * What npm registry returns for attestations (as of december 2025)
 *
 * Wraps an extra layer around {@link SigStoreBundleV0_2}/{@link SigStoreBundleV0_3}
 * and includes `predicateType` to identify the type of attestation.
 */
export interface AttestationBundle<
    T extends string = string,
    B extends SigStoreBundleV0_1 | SigStoreBundleV0_2 | SigStoreBundleV0_3 =
        | SigStoreBundleV0_1
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
export function parseAttestationBundle<
    T extends
        | NpmAttestationPublishBundle
        | SlsaProvenanceV0_2Bundle
        | SlsaProvenanceBundle,
>(
    attBun: T,
): T extends NpmAttestationPublishBundle
    ? NpmPublishStatement
    : T extends SlsaProvenanceV0_2Bundle
      ? SlsaProvenanceV0_2Statement
      : T extends SlsaProvenanceBundle
        ? SlsaProvenanceStatement
        : never {
    if (
        ![
            NpmPublishPredicateType,
            SlsaProvenancePredicateType,
            SlsaProvenanceV0_2PredicateType,
        ].includes(attBun.predicateType)
    ) {
        throw new Error(
            `Unsupported attestation bundle predicate type: "${attBun.predicateType}"`,
        );
    }

    return parseDsseEnvelope(attBun.bundle.dsseEnvelope);
}
