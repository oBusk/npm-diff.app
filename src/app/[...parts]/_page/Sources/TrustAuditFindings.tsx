import type {
    SourceInformation,
    TrustAuditFinding,
} from "^/lib/api/npm/sourceInformation";
import { AuditFindingCard } from "./AuditFindingCard";

export interface TrustAuditFindingsProps {
    findings: TrustAuditFinding[];
    aLabel: string;
    sourceA: SourceInformation | null | undefined;
    sourceB: SourceInformation | null | undefined;
}

export function TrustAuditFindings({
    findings,
    aLabel,
    sourceA,
    sourceB,
}: TrustAuditFindingsProps) {
    return (
        <>
            {findings.map((finding, index) => {
                let title: string;
                let subtitle: string;

                switch (finding.type) {
                    case "lost-provenance":
                        title = "Missing Verifiable Provenance";
                        subtitle = `This version lacks the verifiable provenance found in ${aLabel}. This is a significant trust regression and may indicate a manual publish or a hijacked package.`;
                        break;
                    case "lost-trusted-publisher":
                        title = "Trusted Publishing Bypassed";
                        subtitle = `This release used a legacy token, bypassing the Trusted Publishing policy used by ${aLabel}. This downgrade could indicate a compromised maintainer account or an intentional attempt to evade security controls.`;
                        break;
                    case "repository-change":
                        if (!sourceA || !sourceB) {
                            return null;
                        }
                        title = "Source Repository Mismatch";
                        subtitle = `While both versions have provenance, they originate from different repositories (${sourceA.repositoryPath} vs ${sourceB.repositoryPath}). This is a high-risk signal of a fork-based attack or an unannounced migration.`;
                        break;
                    case "workflow-change":
                        if (!sourceA || !sourceB) {
                            return null;
                        }
                        title = "Build Workflow Modified";
                        subtitle = `The publish was triggered via ${sourceB.buildFileName}, changing from ${sourceA.buildFileName}. While potentially a refactor, an unexpected change in the build "recipe" warrants an audit.`;
                        break;
                    default:
                        throw new Error(
                            `Unknown finding type: ${(finding as { type: string }).type}`,
                        );
                }

                return (
                    <AuditFindingCard
                        key={index}
                        severity={finding.severity}
                        title={title}
                        subtitle={subtitle}
                    />
                );
            })}
        </>
    );
}
