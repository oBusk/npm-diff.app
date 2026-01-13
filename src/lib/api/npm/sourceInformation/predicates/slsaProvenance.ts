import type { AttestationBundle } from "../attestationBundle";
import type { InTotoStatement } from "../inToto";
import type { DsseBundleV0_3 } from "../sigstore";

/**
 * The identifier for SLSA Provenance v1 predicate type.
 *
 * > https://slsa.dev/provenance/v1
 */
export type SlsaProvenancePredicateType = typeof SlsaProvenancePredicateType;
export const SlsaProvenancePredicateType = "https://slsa.dev/provenance/v1";

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
 * > https://slsa.dev/provenance/v1
 */
export type SlsaProvenanceStatement = InTotoStatement<
    SlsaProvenancePredicateType,
    SlsaProvenancePredicate
>;
