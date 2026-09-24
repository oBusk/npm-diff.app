import { isGitHubUrl, isGitLabUrl } from "^/lib/utils/isAllowedRepositoryHost";

export function hrefOnRepositoryHost(
    href: unknown,
    repositoryUrl: string,
): string | undefined {
    if (typeof href !== "string") {
        return undefined;
    }

    if (isGitHubUrl(repositoryUrl)) {
        return isGitHubUrl(href) ? href : undefined;
    }

    if (isGitLabUrl(repositoryUrl)) {
        return isGitLabUrl(href) ? href : undefined;
    }

    return undefined;
}
