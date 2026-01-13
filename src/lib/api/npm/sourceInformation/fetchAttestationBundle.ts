import { type PackageDistAttestations } from "../packument";
import { type NpmAttestationPublishBundle } from "./predicates/npmPublish";
import {
    type SlsaProvenanceBundle,
    SlsaProvenancePredicateType,
} from "./predicates/slsaProvenance";

/**
 * What npm registry returns for attestations (as of december 2025)
 *
 * > Example:
 * > https://registry.npmjs.org/-/npm/v1/attestations/@obusk%2feslint-config-next@15.1.2-6
 */
interface AttestationsResponse {
    attestations?: [NpmAttestationPublishBundle, SlsaProvenanceBundle];
}

/**
 * Fetch attestation bundles from npm registry
 */
export async function fetchAttestationBundles(
    attestations: PackageDistAttestations,
) {
    if (!attestations?.url) {
        throw new Error("No attestation URL found in manifest");
    }

    if (
        attestations.provenance?.predicateType !== SlsaProvenancePredicateType
    ) {
        throw new Error("Unsupported provenance predicate type");
    }

    if (
        !attestations.url.startsWith(
            `https://registry.npmjs.org/-/npm/v1/attestations/`,
        )
    ) {
        throw new Error("Unexpected attestation URL");
    }

    const response = await fetch(attestations.url, {
        headers: {
            Accept: "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(
            `Failed to fetch attestation bundles: ${response.status} ${response.statusText}`,
        );
    }
    const data: AttestationsResponse = await response.json();
    if (
        data.attestations &&
        Array.isArray(data.attestations) &&
        data.attestations.length > 0
    ) {
        return data.attestations;
    } else {
        throw new Error("No attestation bundles found");
    }
}
