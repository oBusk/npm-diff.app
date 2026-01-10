import { Check, FileCode, Info, ShieldCheck, XCircle } from "lucide-react";
import ExternalLink from "^/components/ExternalLink";
import Skeleton from "^/components/ui/Skeleton";
import Tooltip from "^/components/ui/Tooltip";
import getTrustEvidence, {
    type TrustEvidence,
} from "^/lib/api/npm/getTrustEvidence";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";

export interface TrustBadgeProps {
    className?: string;
    pkg: SimplePackageSpec;
    comparisonPkg?: SimplePackageSpec;
    isTarget?: boolean;
}

const TRUST_RANK = {
    trustedPublisher: 2,
    provenance: 1,
    undefined: 0,
} as const;

function getTrustRank(evidence: TrustEvidence): number {
    return TRUST_RANK[evidence ?? "undefined"];
}

const shared = cx(
    "my-1 flex min-h-6 flex-col items-center justify-center gap-1",
);

function getTrustLabel(evidence: TrustEvidence): string {
    switch (evidence) {
        case "trustedPublisher":
            return "Trusted Publisher";
        case "provenance":
            return "Provenance";
        default:
            return "No Evidence";
    }
}

function getTrustTooltip(evidence: TrustEvidence): string {
    switch (evidence) {
        case "trustedPublisher":
            return "Published using a trusted GitHub Actions workflow with OIDC authentication. Highest level of trust.";
        case "provenance":
            return "Published with SLSA provenance attestation. Cryptographically verifiable build information.";
        default:
            return "This package was published without provenance attestation or trusted publisher verification.";
    }
}

function getTrustIcon(evidence: TrustEvidence): React.ReactNode {
    const iconClass = "size-5";
    switch (evidence) {
        case "trustedPublisher":
            return <ShieldCheck className={iconClass} />;
        case "provenance":
            return <Check className={iconClass} />;
        default:
            return <XCircle className={iconClass} />;
    }
}

function getTrustColor(evidence: TrustEvidence): string {
    switch (evidence) {
        case "trustedPublisher":
            return "text-green-600 dark:text-green-400";
        case "provenance":
            return "text-blue-600 dark:text-blue-400";
        default:
            return "text-gray-500 dark:text-gray-400";
    }
}

async function TrustBadge({
    pkg,
    className,
    comparisonPkg,
    isTarget,
}: TrustBadgeProps) {
    const { evidence, provenanceUrl } = await getTrustEvidence(pkg);

    // Determine trust change if comparing
    let isDowngrade = false;
    let isUpgrade = false;
    if (comparisonPkg && isTarget) {
        const { evidence: comparisonEvidence } =
            await getTrustEvidence(comparisonPkg);
        const currentRank = getTrustRank(evidence);
        const comparisonRank = getTrustRank(comparisonEvidence);
        isDowngrade = currentRank < comparisonRank;
        isUpgrade = currentRank > comparisonRank;
    }

    const label = getTrustLabel(evidence);
    const tooltip = getTrustTooltip(evidence);
    const icon = getTrustIcon(evidence);
    const colorClass = getTrustColor(evidence);

    return (
        <div className={cx(shared, className)}>
            <div
                className={cx(
                    "flex items-center justify-center gap-1 rounded px-2 py-1",
                    colorClass,
                    "text-sm font-semibold",
                    isDowngrade &&
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                )}
            >
                {icon}
                <span>{label}</span>
                {evidence !== undefined ? (
                    <Tooltip label={tooltip}>
                        <button
                            type="button"
                            className="inline-flex cursor-help opacity-60 hover:opacity-100"
                            aria-label="More information"
                        >
                            <Info className="size-3.5" />
                        </button>
                    </Tooltip>
                ) : null}
            </div>
            {isDowngrade ? (
                <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                    ⚠️ Trust downgrade
                </div>
            ) : null}
            {isUpgrade ? (
                <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                    ✓ Trust improved
                </div>
            ) : null}
            {provenanceUrl ? (
                <div className="text-xs">
                    <ExternalLink
                        href={provenanceUrl}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                    >
                        <FileCode className="size-3" />
                        Source
                    </ExternalLink>
                </div>
            ) : null}
        </div>
    );
}

function TrustBadgeFallback({ className }: TrustBadgeProps) {
    return (
        <div className={cx(shared, className)}>
            <Skeleton className="h-3 w-24" />
        </div>
    );
}

const SuspensedTrustBadge = suspense(TrustBadge, TrustBadgeFallback);

export default SuspensedTrustBadge;
