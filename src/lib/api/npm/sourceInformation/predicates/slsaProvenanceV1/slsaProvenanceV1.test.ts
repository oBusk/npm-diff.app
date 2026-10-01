import { GithubActionsWorkflowBuildType } from "./buildDefinitions/githubActionsWorkflowBuildDefinition";
import {
    parseSlsaProvenancePredicate,
    type SlsaProvenancePredicate,
} from "./slsaProvenanceV1";

function makePredicate(invocationId: string): SlsaProvenancePredicate {
    return {
        buildDefinition: {
            buildType: GithubActionsWorkflowBuildType,
            externalParameters: {
                workflow: {
                    ref: "refs/tags/v1.0.0",
                    repository: "https://github.com/owner/repo",
                    path: ".github/workflows/publish.yml",
                },
            },
            internalParameters: {},
            resolvedDependencies: [
                {
                    uri: "git+https://github.com/owner/repo@refs/tags/v1.0.0",
                    digest: { gitCommit: "abc123def456" },
                },
            ],
        },
        runDetails: {
            builder: { id: "https://github.com/actions/runner" },
            metadata: { invocationId },
        },
    };
}

describe("parseSlsaProvenancePredicate", () => {
    it("parses GitHub Actions provenance", () => {
        expect(
            parseSlsaProvenancePredicate(
                makePredicate(
                    "https://github.com/owner/repo/actions/runs/1/attempts/1",
                ),
            ),
        ).toEqual({
            buildPlatform: "GitHub Actions",
            commitHash: "abc123def456",
            repositoryPath: "owner/repo",
            repositoryUrl: "https://github.com/owner/repo",
            buildFileName: ".github/workflows/publish.yml",
            buildFileHref:
                "https://github.com/owner/repo/blob/abc123def456/.github/workflows/publish.yml",
            buildSummaryUrl:
                "https://github.com/owner/repo/actions/runs/1/attempts/1",
        });
    });

    it.each([
        "javascript:alert(1)",
        "https://evil.example/owner/repo/actions/runs/1",
        "http://github.com/owner/repo/actions/runs/1",
        "",
    ])("drops the build summary link for %s", (invocationId) => {
        const result = parseSlsaProvenancePredicate(
            makePredicate(invocationId),
        );

        expect(result.buildSummaryUrl).toBeUndefined();
        expect(result.repositoryUrl).toBe("https://github.com/owner/repo");
    });
});
