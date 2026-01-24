import type { InTotoStatement } from "../../protocols/inToto";
import { parseBuildDefinition } from "./buildDefinitions";

/**
 * The identifier for SLSA Provenance v1 predicate type.
 *
 * > https://slsa.dev/provenance/v1
 */
export type SlsaProvenancePredicateType = typeof SlsaProvenancePredicateType;
export const SlsaProvenancePredicateType = "https://slsa.dev/provenance/v1";

/**
 * Describes a resource involved in the build process. Defined by SLSA v1
 *
 * > https://slsa.dev/spec/v1.1/provenance#schema
 */
interface ResourceDescriptor {
    uri: string;
    digest?: {
        [algorithm: string]: string;
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
 * > https://slsa.dev/provenance/v1
 */
export type SlsaProvenanceStatement = InTotoStatement<
    SlsaProvenancePredicateType,
    SlsaProvenancePredicate
>;

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

    return {
        ...parseBuildDefinition(predicate.buildDefinition),
        buildSummaryUrl,
    };
}
