import { type GitlabBuilderSlsaPredicate } from "./builders/GitlabBuilderSlsaPredicate";
import { parseSlsaProvenanceV0_2Predicate } from "./slsaProvenanceV0_2";

function makePredicate(
    buildInvocationId = "https://gitlab.com/group/project/-/jobs/456",
): GitlabBuilderSlsaPredicate {
    return {
        builder: { id: "https://gitlab.com/group/project/-/runners/1" },
        buildType: "https://github.com/npm/cli/gitlab/v0alpha1",
        invocation: {
            configSource: {
                uri: "git+https://gitlab.com/group/project",
                digest: { sha1: "abc123def456" },
                entryPoint: "publish",
            },
            parameters:
                {} as GitlabBuilderSlsaPredicate["invocation"]["parameters"],
            environment: {
                name: "runner",
                architecture: "amd64",
                server: "https://gitlab.com",
                project: "group/project",
                job: { id: "456" },
                pipeline: { id: "123", ref: ".gitlab-ci.yml" },
            },
        },
        buildConfig: {},
        metadata: {
            buildInvocationId,
            buildStartedOn: "",
            buildFinishedOn: "",
            completeness: {
                parameters: true,
                environment: true,
                materials: false,
            },
            reproducible: false,
        },
        materials: [],
    };
}

describe("parseSlsaProvenanceV0_2Predicate (GitLab)", () => {
    it("parses GitLab provenance", () => {
        expect(parseSlsaProvenanceV0_2Predicate(makePredicate())).toEqual({
            buildPlatform: "GitLab CI/CD",
            commitHash: "abc123def456",
            repositoryPath: "group/project",
            repositoryUrl: "https://gitlab.com/group/project",
            buildFileName: ".gitlab-ci.yml",
            buildFileHref: "https://gitlab.com/group/project/-/pipelines/123",
            buildSummaryUrl: "https://gitlab.com/group/project/-/jobs/456",
        });
    });

    it.each([
        "javascript:alert(1)",
        "https://evil.example/group/project/-/jobs/1",
        "https://github.com/group/project",
    ])("drops the build summary link for %s", (buildInvocationId) => {
        expect(
            parseSlsaProvenanceV0_2Predicate(makePredicate(buildInvocationId))
                .buildSummaryUrl,
        ).toBeUndefined();
    });
});
