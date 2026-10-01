import { isGitHubUrl } from "^/lib/utils/isAllowedRepositoryHost";
import { type BuildDefinition, type SlsaProvenancePredicate } from "..";

export const GithubActionsWorkflowBuildType =
    "https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1";
export type GithubActionsWorkflowBuildType =
    typeof GithubActionsWorkflowBuildType;

/**
 * An extension of SLSA Provenance v1 for GitHub Actions builds.
 *
 * Defines what properties npm/github populates the parameters with
 *
 * > https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1
 */
export interface GithubActionsWorkflowBuildDefinition extends BuildDefinition {
    buildType: GithubActionsWorkflowBuildType;
    externalParameters: {
        // There might be lots of other externalParameters here
        workflow: {
            /**
             * E.g. "refs/tags/v1.0.0"
             */
            ref: string;
            /**
             * E.g. "https://github.com/example/example"
             */
            repository: string;
            /**
             * E.g. ".github/workflows/publish.yml"
             */
            path: string;
        };
    };
    internalParameters: {
        github: {
            /** E.g. "push" or "pull_request" */
            event_name: string;
            /** E.g. "123456" */
            repository_id: string;
            /** E.g. "123456" */
            repository_owner_id: string;
        };
    };
}

export function isGithubActionsWorkflowBuildDefinition(
    buildDefinition: BuildDefinition,
): buildDefinition is GithubActionsWorkflowBuildDefinition {
    return buildDefinition.buildType === GithubActionsWorkflowBuildType;
}

export function parseGithubActionsWorkflowBuildDefinition(
    buildDefinition: GithubActionsWorkflowBuildDefinition,
    runDetails: SlsaProvenancePredicate["runDetails"],
) {
    // Get repository URL from external parameters
    const repositoryUrl =
        buildDefinition.externalParameters.workflow.repository;
    if (!repositoryUrl) {
        throw new Error("No repository URL found in provenance");
    }
    const repositoryUrlObj = new URL(repositoryUrl);
    const repositoryPath = repositoryUrlObj.pathname.slice(1); // remove leading '/'

    // Validate it's a GitHub URL (security: only allow github.com as the exact hostname)
    if (!isGitHubUrl(repositoryUrl)) {
        throw new Error("Invalid GitHub repository URL");
    }

    // Get commitHash from resolvedDependencies
    const deps = buildDefinition.resolvedDependencies;
    if (deps.length === 0) {
        throw new Error("No resolved dependencies found in provenance");
    }

    const commitHash = deps[0].digest?.gitCommit;
    if (!commitHash) {
        throw new Error("No commit hash found in resolved dependencies");
    }

    // Get workflow path
    const workflowPath = buildDefinition.externalParameters.workflow.path;
    if (!workflowPath) {
        throw new Error("No workflow path found in provenance");
    }

    const buildSummaryUrl = runDetails?.metadata?.invocationId;

    return {
        buildPlatform: "GitHub Actions",
        commitHash,
        repositoryPath,
        repositoryUrl,
        buildFileName: workflowPath,
        buildFileHref: `${repositoryUrl}/blob/${commitHash}/${workflowPath}`,
        buildSummaryUrl:
            typeof buildSummaryUrl === "string" && isGitHubUrl(buildSummaryUrl)
                ? buildSummaryUrl
                : undefined,
    };
}
