import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import packument, { type Manifest } from "../packument";
import { parseAttestationBundle } from "./attestationBundle";
import { fetchAttestationBundles } from "./fetchAttestationBundle";
import {
    parseSlsaProvenancePredicate,
    parseSlsaProvenanceV0_2Predicate,
    SlsaProvenancePredicateType,
    SlsaProvenanceV0_2PredicateType,
} from "./predicates/slsaProvenance";

export interface SourceInformation {
    /** E.g. "abc123def456" */
    commitHash: string;
    /** E.g. "owner/repo" */
    repositoryPath: string;
    /** E.g. "https://github.com/owner/repo"  or "https://gitlab.com/owner/repo" */
    repositoryUrl: string;
    /** Either "Github Actions" or "GitLab CI/CD" */
    buildPlatform: string;
    /** E.g. ".github/workflows/publish.yml" or ".gitlab-ci.yml" */
    buildFileName: string;
    /** URL to the build file or pipeline */
    buildFileHref: string;
    /** URL to the build summary in Github workflows or GitLab pipelines */
    buildSummaryUrl: string;
    /** The id of the entry in the public ledger in rekor */
    publicLedger: string;
}

export const SupportedAttestationPredicates = [
    SlsaProvenancePredicateType,
    SlsaProvenanceV0_2PredicateType,
];
export type SupportedAttestationPredicate =
    (typeof SupportedAttestationPredicates)[number];

/**
 * Extract provenance URL from manifest if available
 */
async function getSourceFromManifest(
    manifest: Manifest,
): Promise<SourceInformation | undefined> {
    const dist = manifest.dist;
    const attestations = dist?.attestations;
    if (!attestations) {
        return undefined;
    }

    // Fetch the attestation bundle from npm registry
    const bundles = await fetchAttestationBundles(attestations);
    if (!bundles) {
        return undefined;
    }

    const provenanceBundle =
        bundles.find((b) => b.predicateType === SlsaProvenancePredicateType) ??
        bundles.find(
            (b) => b.predicateType === SlsaProvenanceV0_2PredicateType,
        );

    if (!provenanceBundle) {
        throw new Error("No SLSA provenance bundle found");
    }
    const provenanceStatement = parseAttestationBundle(provenanceBundle);

    const tlogIndex =
        provenanceBundle.bundle.verificationMaterial.tlogEntries[0].logIndex;
    if (tlogIndex == null) {
        throw new Error("No tlog index found in verification material");
    }
    if (Number(tlogIndex).toString() !== tlogIndex.toString()) {
        throw new Error("Invalid tlog index format");
    }
    const publicLedger = `https://search.sigstore.dev/?logIndex=${tlogIndex}`;

    console.log(
        "Provenance Statement:",
        JSON.stringify(provenanceStatement, null, 2),
    );

    if (provenanceStatement.predicateType === SlsaProvenanceV0_2PredicateType) {
        return {
            ...parseSlsaProvenanceV0_2Predicate(provenanceStatement.predicate),
            publicLedger,
        };
    } else if (
        provenanceStatement.predicateType === SlsaProvenancePredicateType
    ) {
        return {
            ...parseSlsaProvenancePredicate(provenanceStatement.predicate),
            publicLedger,
        };
    } else {
        throw new Error(
            "Unsupported provenance predicate type: " +
                (
                    provenanceStatement satisfies never as {
                        predicateType: string;
                    }
                ).predicateType,
        );
    }
}

export async function getSourceInformation(
    spec: SimplePackageSpec,
): Promise<null | SourceInformation> {
    const pack = await packument(simplePackageSpecToString(spec));

    const manifest = pack.versions[spec.version];
    if (!manifest) {
        return null;
    }

    const sourceInformation = await getSourceFromManifest(manifest);

    return sourceInformation || null;
}
