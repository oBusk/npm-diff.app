import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import packument, { type Manifest } from "../packument";
import { parseAttestationBundle } from "./attestationBundle";
import { fetchAttestationBundles } from "./fetchAttestationBundle";
import {
    isGithubActionsWorkflowBuildDefinition,
    parseGithubActionsWorkflowBuildDefinition,
} from "./githubActionsWorkflowBuildDefinition";
import { SlsaProvenancePredicateType } from "./predicates/slsaProvenance";

export interface SourceInformation {
    commitHash: string;
    repository: string;
}

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

    const provenanceBundle = bundles.find(
        (b) => b.predicateType === SlsaProvenancePredicateType,
    );

    if (!provenanceBundle) {
        throw new Error("No SLSA provenance bundle found");
    }
    const provenanceStatement = parseAttestationBundle(provenanceBundle);

    const buildDefinition = provenanceStatement.predicate.buildDefinition;
    if (buildDefinition == null) {
        throw new Error("No build definition found in provenance");
    }

    if (isGithubActionsWorkflowBuildDefinition(buildDefinition)) {
        return parseGithubActionsWorkflowBuildDefinition(buildDefinition);
    } else {
        throw new Error("Unsupported build definition type");
    }
}

export async function getSourceInformation(
    spec: SimplePackageSpec,
): Promise<null | SourceInformation> {
    const pack = await packument(simplePackageSpecToString(spec), {
        // Response is too large to cache in Next's Data Cache; always fetch
        cache: "no-store",
    });

    const manifest = pack.versions[spec.version];
    if (!manifest) {
        return null;
    }

    const sourceInformation = await getSourceFromManifest(manifest);

    return sourceInformation || null;
}
