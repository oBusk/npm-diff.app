import { hrefOnRepositoryHost } from "./hrefOnRepositoryHost";

const github = "https://github.com/owner/repo";
const gitlab = "https://gitlab.com/group/project";

describe("hrefOnRepositoryHost", () => {
    it("allows https links on the repository host", () => {
        const href = "https://github.com/owner/repo/actions/runs/1/attempts/1";
        expect(hrefOnRepositoryHost(href, github)).toBe(href);

        const gitlabHref = "https://gitlab.com/group/project/-/jobs/1";
        expect(hrefOnRepositoryHost(gitlabHref, gitlab)).toBe(gitlabHref);
    });

    it.each([
        "http://github.com/owner/repo/actions/runs/1",
        "javascript:alert(1)",
        "https://evil.example/owner/repo",
        "https://github.com.evil.example/owner/repo",
        "https://gitlab.com/group/project/-/jobs/1",
        "not a url",
        "",
    ])("rejects %s for a GitHub repository", (href) => {
        expect(hrefOnRepositoryHost(href, github)).toBeUndefined();
    });

    it("rejects GitHub links for a GitLab repository", () => {
        expect(
            hrefOnRepositoryHost("https://github.com/owner/repo", gitlab),
        ).toBeUndefined();
    });

    it("rejects non-string values", () => {
        expect(hrefOnRepositoryHost(undefined, github)).toBeUndefined();
        expect(hrefOnRepositoryHost(123, github)).toBeUndefined();
    });

    it("rejects everything for an unknown repository host", () => {
        expect(
            hrefOnRepositoryHost(
                "https://example.com/a",
                "https://example.com/owner/repo",
            ),
        ).toBeUndefined();
    });
});
