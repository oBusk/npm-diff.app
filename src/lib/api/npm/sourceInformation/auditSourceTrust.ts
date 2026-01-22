import type { SourceInformation } from "./sourceInformation";

export type TrustAuditSeverity = "red" | "yellow";

export type TrustAuditFindingType =
    | "lost-provenance"
    | "lost-trusted-publisher"
    | "repository-change"
    | "workflow-change";

export interface TrustAuditFinding {
    type: TrustAuditFindingType;
    severity: TrustAuditSeverity;
}

/**
 * Compare two releases' source information and return audit findings
 * when moving from A (usually the older version) to B (usually the newer
 * version).
 */
export function auditSourceTrust(
    sourceA: SourceInformation | null | undefined,
    sourceB: SourceInformation | null | undefined,
): TrustAuditFinding[] {
    const findings: TrustAuditFinding[] = [];

    const hasA = Boolean(sourceA);
    const hasB = Boolean(sourceB);

    // 1. Trust downgrade (red):
    //    - A has provenance but B does not (lost provenance)
    //    - A was published with trusted publisher but B is not (lost trusted publisher)
    const provenanceDowngrade = hasA && !hasB;
    const trustedPublisherDowngrade = Boolean(
        sourceA?.trustedPublisher && !sourceB?.trustedPublisher,
    );

    if (provenanceDowngrade || trustedPublisherDowngrade) {
        if (provenanceDowngrade) {
            findings.push({
                type: "lost-provenance",
                severity: "red",
            });
        }

        if (trustedPublisherDowngrade) {
            findings.push({
                type: "lost-trusted-publisher",
                severity: "red",
            });
        }
    }

    // Remaining checks only apply when both versions have provenance.
    if (!sourceA || !sourceB) {
        return findings;
    }

    // 2. Repository change (red): repository URL differs between A and B.
    if (sourceA.repositoryUrl !== sourceB.repositoryUrl) {
        findings.push({
            type: "repository-change",
            severity: "red",
        });
    }

    // 3. Workflow change (yellow): build workflow file has changed.
    if (sourceA.buildFileName !== sourceB.buildFileName) {
        findings.push({
            type: "workflow-change",
            severity: "yellow",
        });
    }

    return findings;
}
