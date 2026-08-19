export interface ProvenanceInformation {
    /** E.g. "abc123def456" */
    commitHash: string;
    /** E.g. "owner/repo" */
    repositoryPath: string;
    /** E.g. "https://github.com/owner/repo"  or "https://gitlab.com/owner/repo" */
    repositoryUrl: string;
    /** Either "Github Actions" or "GitLab CI/CD" */
    buildPlatform: string;
    /** E.g. ".github/workflows/publish.yml" or ".gitlab-ci.yml" */
    buildFileName: string;
    /** URL to the build file or pipeline */
    buildFileHref: string;
    /** URL to the build summary in Github workflows or GitLab pipelines */
    buildSummaryUrl: string;
    /** The id of the entry in the public ledger in rekor */
    publicLedger: string;
}

export interface SourceInformation {
    /** The npm username that published this release, when known. */
    publishedBy: string | null;
    /**
     * Whether the release was published with Trusted Publisher
     *
     * > https://docs.npmjs.com/trusted-publishers
     */
    hasTrustedPublisher: boolean;
    /** Provenance attestation data, or `null` if the release has none. */
    provenance: ProvenanceInformation | null;
}
