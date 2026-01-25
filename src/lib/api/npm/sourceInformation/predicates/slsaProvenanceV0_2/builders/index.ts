import { type SlsaProvenanceV0_2Predicate } from "..";
import {
    isGitlabBuilderSlsaPredicate,
    parseGitlabBuilderSlsaPredicate,
} from "./GitlabBuilderSlsaPredicate";

/**
 * "Generic" parser for SLSA Provenance v0.2 Builder predicates, so that the
 * SLSA Provenance predicate parser can remain unknowing of specific build types.
 *
 * V1 defines a "buildDefinition", but v0.2 does not limit it to a specific property,
 * the whole predicate is the builder definition.
 */
export function parseBuilderSlsaPredicate(
    predicate: SlsaProvenanceV0_2Predicate,
) {
    if (isGitlabBuilderSlsaPredicate(predicate)) {
        return parseGitlabBuilderSlsaPredicate(predicate);
    }

    throw new Error(`Unsupported SLSA v0.2 build type: ${predicate.buildType}`);
}
