import { type GitlabBuilderSlsaPredicate } from "./builders/GitlabBuilderSlsaPredicate";
import { parseSlsaProvenanceV0_2Predicate } from "./slsaProvenanceV0_2";

function makePredicate({
    project = "group/project",
    pipelineId = "123",
    buildInvocationId = "https://gitlab.com/group/project/-/jobs/456",
}: {
    project?: string;
    pipelineId?: string;
    buildInvocationId?: string;
} = {}): GitlabBuilderSlsaPredicate {
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
                project,
                job: { id: "456" },
                pipeline: { id: pipelineId, ref: ".gitlab-ci.yml" },
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

    it("accepts nested groups and dotted names", () => {
        const result = parseSlsaProvenanceV0_2Predicate(
            makePredicate({ project: "group/sub-group/my.project_1" }),
        );

        expect(result.repositoryUrl).toBe(
            "https://gitlab.com/group/sub-group/my.project_1",
        );
    });

    it.each(["123/../../evil", "abc", "1?x=1", ""])(
        "drops the pipeline link for pipeline id %j",
        (pipelineId) => {
            const result = parseSlsaProvenanceV0_2Predicate(
                makePredicate({ pipelineId }),
            );

            expect(result.buildFileHref).toBeUndefined();
            expect(result.repositoryUrl).toBe(
                "https://gitlab.com/group/project",
            );
        },
    );

    it.each([
        "javascript:alert(1)",
        "https://evil.example/group/project/-/jobs/1",
        "https://github.com/group/project",
    ])("drops the build summary link for %s", (buildInvocationId) => {
        expect(
            parseSlsaProvenanceV0_2Predicate(
                makePredicate({ buildInvocationId }),
            ).buildSummaryUrl,
        ).toBeUndefined();
    });

    it.each([
        "project",
        "group/../other",
        "group/./project",
        "group//project",
        "group/project?x",
        "group/project#x",
        "@evil.example/project",
    ])("rejects invalid project path %j", (project) => {
        expect(() =>
            parseSlsaProvenanceV0_2Predicate(makePredicate({ project })),
        ).toThrow();
    });
});
