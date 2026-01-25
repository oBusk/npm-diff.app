import type {
    DsseBundleV0_1,
    DsseBundleV0_2,
    DsseBundleV0_3,
} from "./sigstore";

type AnyDsseBundle = DsseBundleV0_1 | DsseBundleV0_2 | DsseBundleV0_3;

/**
 * What npm registry returns for attestations (as of december 2025)
 *
 * Wraps an extra layer around
 * {@link DsseBundleV0_1}/{@link DsseBundleV0_2}/{@link DsseBundleV0_3}
 * and includes `predicateType` to identify the type of attestation.
 */
export interface AttestationBundle<
    TBundle extends AnyDsseBundle = AnyDsseBundle,
> {
    predicateType: string;
    bundle: TBundle;
    signedAccessSignatureUrl: string;
}
