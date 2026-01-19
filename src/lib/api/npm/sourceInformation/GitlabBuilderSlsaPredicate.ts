import {
    type SlsaProvenanceV0_2Invocation,
    type SlsaProvenanceV0_2Predicate,
} from "./predicates/slsaProvenance";

interface GitlabBuilderInvocation extends SlsaProvenanceV0_2Invocation {
    parameters: {
        CI: "true";
        CI_API_GRAPHQL_URL: "https://gitlab.com/api/graphql";
        CI_API_V4_URL: "https://gitlab.com/api/v4";
        CI_COMMIT_BEFORE_SHA: string;
        CI_COMMIT_REF_NAME: string;
        CI_COMMIT_REF_PROTECTED: string;
        CI_COMMIT_REF_SLUG: string;
        CI_COMMIT_SHA: string;
        CI_COMMIT_SHORT_SHA: string;
        CI_COMMIT_TIMESTAMP: string;
        CI_COMMIT_TITLE: string;
        CI_CONFIG_PATH: string;
        CI_DEFAULT_BRANCH: string;
        CI_DEPENDENCY_PROXY_DIRECT_GROUP_IMAGE_PREFIX: string;
        CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX: string;
        CI_DEPENDENCY_PROXY_SERVER: string;
        CI_DEPENDENCY_PROXY_USER: string;
        CI_JOB_ID: string;
        CI_JOB_NAME: string;
        CI_JOB_NAME_SLUG: string;
        CI_JOB_STAGE: string;
        CI_JOB_STARTED_AT: string;
        CI_JOB_URL: string;
        CI_NODE_TOTAL: string;
        CI_PAGES_URL: string;
        CI_PIPELINE_CREATED_AT: string;
        CI_PIPELINE_ID: string;
        CI_PIPELINE_IID: string;
        CI_PIPELINE_SOURCE: string;
        CI_PIPELINE_URL: string;
        CI_PROJECT_CLASSIFICATION_LABEL: string;
        CI_PROJECT_DESCRIPTION: string;
        CI_PROJECT_ID: string;
        CI_PROJECT_NAME: string;
        CI_PROJECT_NAMESPACE: string;
        CI_PROJECT_NAMESPACE_ID: string;
        CI_PROJECT_PATH: string;
        CI_PROJECT_PATH_SLUG: string;
        CI_PROJECT_REPOSITORY_LANGUAGES: string;
        CI_PROJECT_ROOT_NAMESPACE: string;
        CI_PROJECT_TITLE: string;
        CI_PROJECT_URL: string;
        CI_PROJECT_VISIBILITY: string;
        CI_REGISTRY: string;
        CI_REGISTRY_USER: string;
        CI_RUNNER_DESCRIPTION: string;
        CI_RUNNER_ID: string;
        CI_RUNNER_TAGS: string;
        CI_SERVER_HOST: string;
        CI_SERVER_NAME: string;
        CI_SERVER_PORT: string;
        CI_SERVER_PROTOCOL: string;
        CI_SERVER_REVISION: string;
        CI_SERVER_SHELL_SSH_HOST: string;
        CI_SERVER_SHELL_SSH_PORT: string;
        CI_SERVER_URL: string;
        CI_SERVER_VERSION: string;
        CI_SERVER_VERSION_MAJOR: string;
        CI_SERVER_VERSION_MINOR: string;
        CI_SERVER_VERSION_PATCH: string;
        CI_TEMPLATE_REGISTRY_HOST: string;
        GITLAB_CI: string;
        GITLAB_FEATURES: string;
        GITLAB_USER_ID: string;
        GITLAB_USER_LOGIN: string;
        [key: string]: string;
    };
    environment: {
        name: string;
        architecture: string;
        server: "https://gitlab.com";
        project: string;
        job: {
            id: string;
        };
        pipeline: {
            id: string;
            ref: string;
        };
    };
}

export interface GitlabBuilderSlsaPredicate extends SlsaProvenanceV0_2Predicate {
    buildType: "https://github.com/npm/cli/gitlab/v0alpha1";
    invocation: GitlabBuilderInvocation;
}

export function isGitlabBuilderSlsaPredicate(
    predicate: SlsaProvenanceV0_2Predicate,
): predicate is GitlabBuilderSlsaPredicate {
    return predicate.buildType === "https://github.com/npm/cli/gitlab/v0alpha1";
}

export function parseGitlabBuilderSlsaPredicate(
    predicate: GitlabBuilderSlsaPredicate,
) {
    const commitHash = predicate.invocation.configSource.digest.sha1;
    if (!commitHash) {
        throw new Error("No commit hash found in GitLab SLSA provenance");
    }

    const repositoryPath = predicate.invocation.environment.project;
    if (!repositoryPath) {
        throw new Error("No repository name found in GitLab SLSA provenance");
    }
    const repositoryUrl = `https://gitlab.com/${repositoryPath}`;

    const buildFileName = predicate.invocation.environment.pipeline.ref;
    if (!buildFileName) {
        throw new Error("No build file found in GitLab SLSA provenance");
    }

    return {
        buildPlatform: "GitLab CI/CD",
        commitHash,
        repositoryPath,
        repositoryUrl,
        buildFileName,
        buildFileHref: `https://gitlab.com/${repositoryPath}/-/pipelines/${predicate.invocation.environment.pipeline.id}`,
    };
}
