import { SlsaProvenanceV0_2PredicateType } from "./predicates/slsaProvenanceV0_2";
import { SlsaProvenancePredicateType } from "./predicates/slsaProvenanceV1";

/**
 * Predicate types that this application knows how to interpret.
 *
 * Keep this list in sync with the predicate types handled in
 * `getSourceFromManifest`.
 */
export const SupportedAttestationPredicates = [
    SlsaProvenancePredicateType,
    SlsaProvenanceV0_2PredicateType,
];

export type SupportedAttestationPredicate =
    (typeof SupportedAttestationPredicates)[number];
