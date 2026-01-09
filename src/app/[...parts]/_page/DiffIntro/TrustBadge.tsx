import { Check, Info, ShieldCheck, XCircle } from "lucide-react";
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
}

const shared = cx("my-1 flex h-5 items-center justify-center gap-1");

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
    const iconClass = "size-4";
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

async function TrustBadge({ pkg, className }: TrustBadgeProps) {
    const { evidence, provenanceUrl } = await getTrustEvidence(pkg);

    const label = getTrustLabel(evidence);
    const tooltip = getTrustTooltip(evidence);
    const icon = getTrustIcon(evidence);
    const colorClass = getTrustColor(evidence);

    const content = (
        <div
            className={cx(shared, colorClass, "text-xs font-medium", className)}
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
                        <Info className="size-3" />
                    </button>
                </Tooltip>
            ) : null}
        </div>
    );

    if (provenanceUrl) {
        return (
            <ExternalLink
                href={provenanceUrl}
                className="hover:underline"
                title="View source on GitHub"
            >
                {content}
            </ExternalLink>
        );
    }

    return content;
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
