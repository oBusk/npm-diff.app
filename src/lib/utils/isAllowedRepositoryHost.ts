/** Parses URL and checks if hostname exactly matches the expected host. */
function isHostUrl(url: string, expectedHost: string): boolean {
    try {
        const { protocol, hostname } = new URL(url);
        return protocol === "https:" && hostname.toLowerCase() === expectedHost;
    } catch {
        return false;
    }
}

export function isGitHubUrl(url: string): boolean {
    return isHostUrl(url, "github.com");
}

export function isGitLabUrl(url: string): boolean {
    return isHostUrl(url, "gitlab.com");
}
