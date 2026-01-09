import { cacheLife } from "next/cache";
import trustComparison from "^/lib/api/npm/trustComparison";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";
import measuredPromise from "^/lib/utils/measuredPromise";
import TrustComparison, { TrustComparisonSkeleton } from "./TrustComparison";

export interface TrustDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
}

const TrustDiffInner = async ({ specs, a, b }: TrustDiffProps) => {
    "use cache";

    // Cache for hours since trust evidence doesn't change often
    cacheLife("hours");

    const { result, time } = await measuredPromise(trustComparison(specs));

    console.log("Trust comparison", { specs, time });

    // Don't render if both packages have no trust evidence
    if (result.a.evidence == null && result.b.evidence == null) {
        return null;
    }

    return (
        <TrustComparison
            a={a}
            b={b}
            aEvidence={result.a.evidence}
            bEvidence={result.b.evidence}
            aProvenanceUrl={result.a.provenanceUrl}
            bProvenanceUrl={result.b.provenanceUrl}
        />
    );
};

const TrustDiffSkeleton = () => <TrustComparisonSkeleton />;

const TrustDiff = suspense(TrustDiffInner, TrustDiffSkeleton);

export default TrustDiff;
