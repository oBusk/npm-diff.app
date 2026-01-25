import type { DigestSet, InTotoStatement } from "../../protocols/inToto";
import { parseBuilderSlsaPredicate } from "./builders";

/**
 * The identifier for SLSA Provenance v0.2 predicate type.
 *
 * > https://slsa.dev/provenance/v0.2
 */
export type SlsaProvenanceV0_2PredicateType =
    typeof SlsaProvenanceV0_2PredicateType;
export const SlsaProvenanceV0_2PredicateType =
    "https://slsa.dev/provenance/v0.2";

export interface SlsaProvenanceV0_2Invocation {
    configSource: {
        /** E.g "git+https://gitlab.com/example/repo" */
        uri: string;
        /**
         * E.g the commit hash
         *
         * ```
         * {
         *   "sha1": "abc123..."
         * }
         * ```
         */
        digest: DigestSet;
        /** E.g. "publish" */
        entryPoint: string;
    };
    parameters: {
        [key: string]: unknown; // any JSON type
    };
    environment: {
        [key: string]: unknown; // any JSON type
    };
}

/**
 * The predicate for SLSA Provenance v0.2 attestations. Extracted from a {@link SlsaProvenanceV0_2Bundle}.
 *
 * > https://slsa.dev/spec/v0.2/provenance#schema
 */
export interface SlsaProvenanceV0_2Predicate {
    builder: {
        /** <URI> */
        id: string;
    };
    /** <URI> */
    buildType: string;
    invocation: SlsaProvenanceV0_2Invocation;
    buildConfig: {
        [key: string]: unknown; // any JSON type
    };
    metadata: {
        buildInvocationId: string;
        buildStartedOn: string;
        buildFinishedOn: string;
        completeness: {
            parameters: boolean;
            environment: boolean;
            materials: boolean;
        };
        reproducible: boolean;
    };
    materials: Array<{
        /** <URI> */
        uri: string;
        digest: DigestSet;
    }>;
}

/**
 * A {@link SlsaProvenancePredicate} wrapped as an {@link InTotoStatement}.
 *
 * > https://slsa.dev/provenance/v0.2
 */
export type SlsaProvenanceV0_2Statement = InTotoStatement<
    SlsaProvenanceV0_2PredicateType,
    SlsaProvenanceV0_2Predicate
>;

export function parseSlsaProvenanceV0_2Predicate(
    predicate: SlsaProvenanceV0_2Predicate,
) {
    const buildSummaryUrl = predicate.metadata.buildInvocationId;
    if (!buildSummaryUrl) {
        throw new Error(
            "No build summary URL found in SLSA v0.2 provenance predicate",
        );
    }

    return {
        buildSummaryUrl,
        ...parseBuilderSlsaPredicate(predicate),
    };
}
