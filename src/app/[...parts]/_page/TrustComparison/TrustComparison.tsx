import { type FunctionComponent } from "react";
import ExternalLink from "^/components/ExternalLink";
import type { TrustEvidence } from "^/lib/api/npm/getTrustEvidence";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import Halfs from "../DiffIntro/Halfs";

const TRUST_RANK = {
    trustedPublisher: 2,
    provenance: 1,
    undefined: 0,
} as const;

function getTrustRank(evidence: TrustEvidence): number {
    return TRUST_RANK[evidence ?? "undefined"];
}

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

function getTrustIcon(evidence: TrustEvidence): string {
    switch (evidence) {
        case "trustedPublisher":
            // Shield with checkmark
            return "🛡️✓";
        case "provenance":
            // Checkmark
            return "✓";
        default:
            // X mark
            return "✕";
    }
}

function getTrustColor(evidence: TrustEvidence, isDowngrade: boolean): string {
    if (isDowngrade) {
        return "text-red-600 dark:text-red-400";
    }
    switch (evidence) {
        case "trustedPublisher":
            return "text-green-600 dark:text-green-400";
        case "provenance":
            return "text-blue-600 dark:text-blue-400";
        default:
            return "text-gray-500 dark:text-gray-400";
    }
}

interface TrustBoxProps {
    evidence: TrustEvidence;
    provenanceUrl?: string;
    isDowngrade?: boolean;
    isUpgrade?: boolean;
}

const TrustBox: FunctionComponent<TrustBoxProps> = ({
    evidence,
    provenanceUrl,
    isDowngrade = false,
    isUpgrade = false,
}) => {
    const label = getTrustLabel(evidence);
    const tooltip = getTrustTooltip(evidence);
    const icon = getTrustIcon(evidence);
    const colorClass = getTrustColor(evidence, isDowngrade);

    return (
        <div className="flex flex-col items-center gap-2 p-2">
            <div
                className={cx(
                    "flex flex-col items-center gap-1 text-center",
                    colorClass,
                )}
                title={tooltip}
            >
                <div className="text-4xl" aria-hidden="true">
                    {icon}
                </div>
                <p className="text-sm font-semibold">{label}</p>
                <span
                    className="inline-block cursor-help text-xs opacity-60"
                    title={tooltip}
                >
                    ℹ️
                </span>
            </div>
            {isDowngrade ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                    ⚠️ Trust downgrade
                </p>
            ) : null}
            {isUpgrade ? (
                <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Trust improvement
                </p>
            ) : null}
            {provenanceUrl ? (
                <div className="text-xs">
                    <ExternalLink
                        href={provenanceUrl}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        📦 Source
                    </ExternalLink>
                </div>
            ) : null}
        </div>
    );
};

export interface TrustComparisonProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    aEvidence: TrustEvidence;
    bEvidence: TrustEvidence;
    aProvenanceUrl?: string;
    bProvenanceUrl?: string;
}

/** The padding of the center column and the right/left half has to be the same to line up */
const COMMON_PADDING = "p-2";

const TrustComparison: FunctionComponent<TrustComparisonProps> = ({
    aEvidence,
    bEvidence,
    aProvenanceUrl,
    bProvenanceUrl,
}) => {
    const aRank = getTrustRank(aEvidence);
    const bRank = getTrustRank(bEvidence);
    const isDowngrade = bRank < aRank;
    const isUpgrade = bRank > aRank;

    const compareUrl =
        aProvenanceUrl && bProvenanceUrl
            ? getGitHubCompareUrl(aProvenanceUrl, bProvenanceUrl)
            : undefined;

    return (
        <>
            <div className={cx("mb-2 text-center text-sm font-semibold")}>
                Trust Level
            </div>
            <Halfs
                className="w-full"
                left={
                    <TrustBox
                        evidence={aEvidence}
                        provenanceUrl={aProvenanceUrl}
                    />
                }
                center={
                    <section className={cx(COMMON_PADDING, "text-center")}>
                        <p>Trust</p>
                    </section>
                }
                right={
                    <TrustBox
                        evidence={bEvidence}
                        provenanceUrl={bProvenanceUrl}
                        isDowngrade={isDowngrade}
                        isUpgrade={isUpgrade}
                    />
                }
            />
            {compareUrl ? (
                <div className="mt-2 text-center text-xs">
                    <ExternalLink
                        href={compareUrl}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        ⇄ Compare source
                    </ExternalLink>
                </div>
            ) : null}
        </>
    );
};

/**
 * Extract GitHub compare URL from two provenance URLs
 */
function getGitHubCompareUrl(aUrl: string, bUrl: string): string | undefined {
    // Match both /commit/ and /tree/ URLs
    const aMatch = aUrl.match(
        /github\.com\/([^/]+\/[^/]+)\/(?:commit|tree)\/([a-f0-9]+)/,
    );
    const bMatch = bUrl.match(
        /github\.com\/([^/]+\/[^/]+)\/(?:commit|tree)\/([a-f0-9]+)/,
    );

    if (aMatch && bMatch && aMatch[1] === bMatch[1]) {
        const repo = aMatch[1];
        const aCommit = aMatch[2];
        const bCommit = bMatch[2];
        return `https://github.com/${repo}/compare/${aCommit}...${bCommit}`;
    }

    return undefined;
}

export default TrustComparison;
