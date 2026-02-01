import { isGitHubUrl, isGitLabUrl } from "./isAllowedRepositoryHost";

describe("isGitHubUrl", () => {
    it("returns true for valid GitHub URL", () => {
        expect(isGitHubUrl("https://github.com/owner/repo")).toBe(true);
    });

    it("returns true for GitHub URL with path", () => {
        expect(isGitHubUrl("https://github.com/owner/repo/tree/main")).toBe(
            true,
        );
    });

    it("returns false for GitLab URL", () => {
        expect(isGitHubUrl("https://gitlab.com/owner/repo")).toBe(false);
    });

    it("rejects subdomain attack: github.com.evil.com", () => {
        expect(isGitHubUrl("https://github.com.evil.com/repo")).toBe(false);
    });

    it("rejects subdomain attack: evil-github.com", () => {
        expect(isGitHubUrl("https://evil-github.com/repo")).toBe(false);
    });

    it("rejects path injection: evil.com/github.com", () => {
        expect(isGitHubUrl("https://evil.com/github.com/repo")).toBe(false);
    });

    it("rejects subdomain: api.github.com", () => {
        expect(isGitHubUrl("https://api.github.com/repo")).toBe(false);
    });

    it("rejects HTTP (non-HTTPS)", () => {
        expect(isGitHubUrl("http://github.com/owner/repo")).toBe(false);
    });

    it("rejects invalid URL", () => {
        expect(isGitHubUrl("not-a-url")).toBe(false);
    });
});

describe("isGitLabUrl", () => {
    it("returns true for valid GitLab URL", () => {
        expect(isGitLabUrl("https://gitlab.com/owner/repo")).toBe(true);
    });

    it("returns true for GitLab URL with path", () => {
        expect(isGitLabUrl("https://gitlab.com/owner/repo/-/tree/main")).toBe(
            true,
        );
    });

    it("returns false for GitHub URL", () => {
        expect(isGitLabUrl("https://github.com/owner/repo")).toBe(false);
    });

    it("rejects subdomain attack: gitlab.com.evil.com", () => {
        expect(isGitLabUrl("https://gitlab.com.evil.com/repo")).toBe(false);
    });

    it("rejects HTTP (non-HTTPS)", () => {
        expect(isGitLabUrl("http://gitlab.com/owner/repo")).toBe(false);
    });

    it("rejects invalid URL", () => {
        expect(isGitLabUrl("not-a-url")).toBe(false);
    });
});
