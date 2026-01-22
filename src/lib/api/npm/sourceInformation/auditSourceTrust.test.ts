import { auditSourceTrust, type TrustAuditFinding } from "./auditSourceTrust";
import type { SourceInformation } from "./sourceInformation";

function makeSourceInformation(
    overrides: Partial<SourceInformation> = {},
): SourceInformation {
    return {
        commitHash: "abc123def456",
        repositoryPath: "owner/repo",
        repositoryUrl: "https://github.com/owner/repo",
        buildPlatform: "Github Actions",
        buildFileName: ".github/workflows/publish.yml",
        buildFileHref:
            "https://github.com/owner/repo/actions/workflows/publish.yml",
        buildSummaryUrl: "https://github.com/owner/repo/actions/runs/1",
        publicLedger: "rekor-entry-id",
        trustedPublisher: false,
        ...overrides,
    };
}

function findFinding(
    findings: TrustAuditFinding[],
    type: TrustAuditFinding["type"],
) {
    return findings.find((finding) => finding.type === type);
}

describe("auditSourceTrust", () => {
    it("returns empty array when neither version has provenance", () => {
        expect(auditSourceTrust(null, null)).toEqual([]);
        expect(auditSourceTrust(undefined, undefined)).toEqual([]);
    });

    it("flags a red lost-provenance finding when provenance is lost", () => {
        const sourceA = makeSourceInformation();
        const findings = auditSourceTrust(sourceA, null);

        expect(findings).toHaveLength(1);
        const lostProvenance = findFinding(findings, "lost-provenance");
        expect(lostProvenance).toBeDefined();
        expect(lostProvenance?.severity).toBe("red");
    });

    it("flags a red lost-trusted-publisher finding when trusted publisher is lost", () => {
        const sourceA = makeSourceInformation({ trustedPublisher: true });
        const sourceB = makeSourceInformation({ trustedPublisher: false });

        const findings = auditSourceTrust(sourceA, sourceB);

        const lostTrustedPublisher = findFinding(
            findings,
            "lost-trusted-publisher",
        );
        expect(lostTrustedPublisher).toBeDefined();
        expect(lostTrustedPublisher?.severity).toBe("red");
    });

    it("does not flag trust downgrade findings when trust increases or stays the same", () => {
        const withoutTrustedPublisher = makeSourceInformation({
            trustedPublisher: false,
        });
        const withTrustedPublisher = makeSourceInformation({
            trustedPublisher: true,
        });

        // Upgrade in trust
        expect(
            findFinding(
                auditSourceTrust(withoutTrustedPublisher, withTrustedPublisher),
                "lost-trusted-publisher",
            ),
        ).toBeUndefined();

        // Same level of trust
        expect(
            findFinding(
                auditSourceTrust(withTrustedPublisher, withTrustedPublisher),
                "lost-trusted-publisher",
            ),
        ).toBeUndefined();

        // Provenance is not lost in these scenarios either
        expect(
            findFinding(
                auditSourceTrust(withTrustedPublisher, withTrustedPublisher),
                "lost-provenance",
            ),
        ).toBeUndefined();
    });

    it("flags a red repository change when repository URL differs", () => {
        const sourceA = makeSourceInformation({
            repositoryUrl: "https://github.com/owner/repo",
        });
        const sourceB = makeSourceInformation({
            repositoryUrl: "https://gitlab.com/other/repo",
            repositoryPath: "other/repo",
        });

        const findings = auditSourceTrust(sourceA, sourceB);

        const repoChange = findFinding(findings, "repository-change");
        expect(repoChange).toBeDefined();
        expect(repoChange?.severity).toBe("red");
    });

    it("flags a yellow workflow change when build file changes", () => {
        const sourceA = makeSourceInformation({
            buildFileName: ".github/workflows/publish.yml",
        });
        const sourceB = makeSourceInformation({
            buildFileName: ".github/workflows/release.yml",
        });

        const findings = auditSourceTrust(sourceA, sourceB);

        const workflowChange = findFinding(findings, "workflow-change");
        expect(workflowChange).toBeDefined();
        expect(workflowChange?.severity).toBe("yellow");
    });

    it("returns multiple findings when several conditions are met", () => {
        const sourceA = makeSourceInformation({
            trustedPublisher: true,
            repositoryUrl: "https://github.com/owner/repo",
            buildFileName: ".github/workflows/publish.yml",
        });
        const sourceB = makeSourceInformation({
            trustedPublisher: false,
            repositoryUrl: "https://gitlab.com/other/repo",
            repositoryPath: "other/repo",
            buildFileName: ".github/workflows/release.yml",
        });

        const findings = auditSourceTrust(sourceA, sourceB);

        expect(findFinding(findings, "lost-provenance")).toBeUndefined();
        expect(findFinding(findings, "lost-trusted-publisher")).toBeDefined();
        expect(findFinding(findings, "repository-change")).toBeDefined();
        expect(findFinding(findings, "workflow-change")).toBeDefined();
    });
});
