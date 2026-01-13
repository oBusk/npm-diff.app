import { type BuildDefinition } from "./predicates/slsaProvenance";
import { type SourceInformation } from "./sourceInformation";

export const GithubActionsWorkflowBuildType =
    "https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1";
export type GithubActionsWorkflowBuildType =
    typeof GithubActionsWorkflowBuildType;

/**
 * An extension of SLSA Provenance v1 for GitHub Actions builds.
 *
 * Defines what properties npm/github populates the parameters with
 *
 * TODO: There's some version of this for GitLab too, I guess
 *
 * > https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1
 */
export interface GithubActionsWorkflowBuildDefinition extends BuildDefinition {
    buildType: GithubActionsWorkflowBuildType;
    externalParameters: {
        // There might be lot's of other externalParameters here
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

/**
 * Validate that a URL is a proper GitHub repository URL
 * Security: Only allow github.com as the exact hostname (not as part of path or subdomain)
 */
export function isValidGitHubUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        // Only allow github.com as the hostname
        return parsed.hostname === "github.com" && parsed.protocol === "https:";
    } catch {
        return false;
    }
}

export function parseGithubActionsWorkflowBuildDefinition(
    buildDefinition: GithubActionsWorkflowBuildDefinition,
): SourceInformation {
    // Get repository URL from external parameters
    const repository = buildDefinition.externalParameters.workflow.repository;
    if (!repository) {
        throw new Error("No repository URL found in provenance");
    }

    // Validate it's a GitHub URL (security: only allow github.com as the exact hostname)
    if (!isValidGitHubUrl(repository)) {
        throw new Error("Invalid GitHub repository URL");
    }

    // Get commitHash from resolvedDependencies
    const deps = buildDefinition.resolvedDependencies;
    if (deps.length === 0) {
        throw new Error("No resolved dependencies found in provenance");
    }

    const commitHash = deps[0].digest.gitCommit;
    if (!commitHash) {
        throw new Error("No commit hash found in resolved dependencies");
    }

    return {
        commitHash,
        repository,
    };
}
