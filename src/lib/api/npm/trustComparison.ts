import getTrustEvidence, { type TrustInfo } from "./getTrustEvidence";

export interface TrustComparisonResult {
    a: TrustInfo;
    b: TrustInfo;
}

/**
 * Fetch trust evidence for both packages in a comparison
 */
export default async function trustComparison(
    specs: [string, string],
): Promise<TrustComparisonResult> {
    const [a, b] = await Promise.all([
        getTrustEvidence(specs[0]),
        getTrustEvidence(specs[1]),
    ]);

    return { a, b };
}
