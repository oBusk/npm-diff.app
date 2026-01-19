import { type BuildDefinition } from "../slsaProvenanceV1";
import {
    isGithubActionsWorkflowBuildDefinition,
    parseGithubActionsWorkflowBuildDefinition,
} from "./githubActionsWorkflowBuildDefinition";

/**
 * "Generic" parser for SLSA Provenance v1 BuildDefinitions, so that the
 * SLSA Provenance predicate parser can remain unknowing of specific build types.
 */
export function parseBuildDefinition(buildDefinition: BuildDefinition) {
    if (buildDefinition == null) {
        throw new Error(
            "Build definition missing in SLSA v1 provenance predicate",
        );
    }

    if (isGithubActionsWorkflowBuildDefinition(buildDefinition)) {
        return parseGithubActionsWorkflowBuildDefinition(buildDefinition);
    }

    throw new Error(
        `Unsupported SLSA Provenance v1 BuildDefinition type: ${buildDefinition.buildType}`,
    );
}
