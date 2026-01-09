"use client";

import {
    CheckCircle2,
    FileCode,
    GitCompareArrows,
    Info,
    Shield,
    XCircle,
} from "lucide-react";
import { type FunctionComponent } from "react";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Tooltip from "^/components/ui/Tooltip";
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

function getTrustIcon(evidence: TrustEvidence): React.ReactNode {
    switch (evidence) {
        case "trustedPublisher":
            // Shield with checkmark
            return (
                <div className="relative">
                    <Shield className="size-12" />
                    <CheckCircle2 className="absolute -right-1 -top-1 size-5" />
                </div>
            );
        case "provenance":
            // Checkmark
            return <CheckCircle2 className="size-12" />;
        default:
            // X mark
            return <XCircle className="size-12" />;
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
                    "flex flex-col items-center gap-2 text-center",
                    colorClass,
                )}
            >
                <div aria-hidden="true">{icon}</div>
                <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold">{label}</p>
                    {evidence !== undefined ? (
                        <Tooltip label={tooltip}>
                            <button
                                type="button"
                                className="inline-flex cursor-help opacity-60 hover:opacity-100"
                                aria-label="More information"
                            >
                                <Info className="size-4" />
                            </button>
                        </Tooltip>
                    ) : null}
                </div>
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
            ) : (
                // Reserve space to keep alignment when there's no upgrade/downgrade message
                <p className="invisible text-xs">Placeholder</p>
            )}
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
                <div className="mb-4 mt-2 text-center">
                    <Button variant="secondary" size="sm" asChild>
                        <ExternalLink
                            href={compareUrl}
                            className="inline-flex items-center gap-2"
                        >
                            <GitCompareArrows className="size-4" />
                            Compare source
                        </ExternalLink>
                    </Button>
                </div>
            ) : (
                <div className="mb-4" />
            )}
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
