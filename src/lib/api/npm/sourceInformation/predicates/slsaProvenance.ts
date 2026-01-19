import type { AttestationBundle } from "../attestationBundle";
import {
    isGithubActionsWorkflowBuildDefinition,
    parseGithubActionsWorkflowBuildDefinition,
} from "../githubActionsWorkflowBuildDefinition";
import {
    isGitlabBuilderSlsaPredicate,
    parseGitlabBuilderSlsaPredicate,
} from "../GitlabBuilderSlsaPredicate";
import type { DigestSet, InTotoStatement } from "../inToto";
import type { DsseBundleV0_1, DsseBundleV0_3 } from "../sigstore";

/**
 * The identifier for SLSA Provenance v1 predicate type.
 *
 * > https://slsa.dev/provenance/v1
 */
export type SlsaProvenancePredicateType = typeof SlsaProvenancePredicateType;
export const SlsaProvenancePredicateType = "https://slsa.dev/provenance/v1";

/**
 * The identifier for SLSA Provenance v0.2 predicate type.
 *
 * > https://slsa.dev/provenance/v0.2
 */
export type SlsaProvenanceV0_2PredicateType =
    typeof SlsaProvenanceV0_2PredicateType;
export const SlsaProvenanceV0_2PredicateType =
    "https://slsa.dev/provenance/v0.2";

/**
 * {@link SlsaProvenancePredicate},
 * encoded in an {@link InTotoStatement},
 * wrapped in a {@link DsseBundleV0_3 SigStore DSSE Bundle},
 * wrapped in an {@link AttestationBundle}.
 *
 * > Example:
 * > https://registry.npmjs.org/-/npm/v1/attestations/@obusk%2feslint-config-next@15.1.2-6
 */
export type SlsaProvenanceBundle = AttestationBundle<
    SlsaProvenancePredicateType,
    DsseBundleV0_3
>;

export type SlsaProvenanceV0_2Bundle = AttestationBundle<
    SlsaProvenanceV0_2PredicateType,
    DsseBundleV0_1
>;

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
 * Describes a resource involved in the build process. Defined by SLSA v1
 *
 * > https://slsa.dev/spec/v1.1/provenance#schema
 */
interface ResourceDescriptor {
    uri: string;
    digest: {
        sha256: string;
        sha512: string;
        gitCommit: string;
        [key: string]: string;
    };
    name: string;
    downloadLocation: string;
    mediaType: string;
    content: string;
    annotations: {
        [key: string]: unknown; // any JSON type
    };
}

/**
 * SLSA leaves this generic to allow for different BuildDefinition types.
 *
 * > https://slsa.dev/spec/v1.1/provenance#schema
 */
export interface BuildDefinition {
    buildType: string;
    externalParameters: object;
    internalParameters: object;
    resolvedDependencies: Array<ResourceDescriptor>;
}

/**
 * The predicate for SLSA Provenance v1 attestations. Extracted from a {@link SlsaProvenanceBundle}.
 *
 * > https://slsa.dev/spec/v1.1/provenance#schema
 */
export interface SlsaProvenancePredicate<
    BD extends BuildDefinition = BuildDefinition,
> {
    buildDefinition: BD;
    runDetails: {
        builder: {
            id: string;
            builderDependencies?: Array<ResourceDescriptor>;
            version?: unknown;
        };
        metadata: {
            invocationId: string;
            startedOn?: string;
            finishedOn?: string;
        };
        byproducts?: Array<ResourceDescriptor>;
    };
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

/**
 * A {@link SlsaProvenancePredicate} wrapped as an {@link InTotoStatement}.
 *
 * > https://slsa.dev/provenance/v1
 */
export type SlsaProvenanceStatement = InTotoStatement<
    SlsaProvenancePredicateType,
    SlsaProvenancePredicate
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

    if (isGitlabBuilderSlsaPredicate(predicate)) {
        return {
            ...parseGitlabBuilderSlsaPredicate(predicate),
            buildSummaryUrl,
        };
    } else {
        throw new Error(
            `Unsupported SLSA v0.2 build type: ${predicate.buildType}`,
        );
    }
}

export function parseSlsaProvenancePredicate(
    predicate: SlsaProvenancePredicate,
) {
    // Get build summary URL from runDetails
    const buildSummaryUrl = predicate.runDetails.metadata.invocationId;
    if (!buildSummaryUrl) {
        throw new Error(
            "No build summary URL found in SLSA v1 provenance predicate",
        );
    }

    const buildDefinition = predicate.buildDefinition;
    if (buildDefinition == null) {
        throw new Error(
            "No build definition found in SLSA v1 provenance predicate",
        );
    }

    if (isGithubActionsWorkflowBuildDefinition(buildDefinition)) {
        return {
            ...parseGithubActionsWorkflowBuildDefinition(buildDefinition),
            buildSummaryUrl,
        };
    } else {
        throw new Error(
            `Unsupported SLSA v1 build definition type: ${buildDefinition.buildType}`,
        );
    }
}
