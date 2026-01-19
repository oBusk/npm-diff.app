import type { InTotoStatement } from "../protocols/inToto";

/**
 * The identifier for npm publish attestation predicate type.
 *
 * > https://github.com/npm/attestation/tree/main/specs/publish/v0.1
 */
export type NpmPublishPredicateType = typeof NpmPublishPredicateType;
export const NpmPublishPredicateType =
    "https://github.com/npm/attestation/tree/main/specs/publish/v0.1";

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
