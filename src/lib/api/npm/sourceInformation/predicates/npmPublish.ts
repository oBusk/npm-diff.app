import type { AttestationBundle } from "../attestationBundle";
import type { InTotoStatement } from "../inToto";
import type { DsseBundleV0_2 } from "../sigstore";

/**
 * The identifier for npm publish attestation predicate type.
 *
 * > https://github.com/npm/attestation/tree/main/specs/publish/v0.1
 */
export type NpmPublishPredicateType = typeof NpmPublishPredicateType;
export const NpmPublishPredicateType =
    "https://github.com/npm/attestation/tree/main/specs/publish/v0.1";

/**
 * {@link NpmPublishPredicate},
 * encoded in an {@link InTotoStatement},
 * wrapped in a {@link DsseBundleV0_2 SigStore DSSE Bundle},
 * wrapped in an {@link AttestationBundle}.
 *
 * > Example:
 * > https://registry.npmjs.org/-/npm/v1/attestations/@obusk%2feslint-config-next@15.1.2-6
 */
export type NpmAttestationPublishBundle = AttestationBundle<
    NpmPublishPredicateType,
    DsseBundleV0_2
>;

/**
 * The predicate for npm publish attestations. Extracted from a {@link NpmAttestationPublishBundle}.
 *
 * > https://github.com/npm/attestation/tree/main/specs/publish/v0.1
 */
export interface NpmPublishPredicate {
    name: string;
    version: string;
    registry: string;
}

/**
 * A {@link NpmPublishPredicate} wrapped as an {@link InTotoStatement}.
 *
 * > https://github.com/npm/attestation/tree/main/specs/publish/v0.1
 */
export type NpmPublishStatement = InTotoStatement<
    NpmPublishPredicateType,
    NpmPublishPredicate
>;
