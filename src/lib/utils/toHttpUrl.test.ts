import { bareDomainToHttpsUrl, toHttpUrl } from "./toHttpUrl";

describe("toHttpUrl", () => {
    it.each([
        ["https://github.com/owner/repo", "https://github.com/owner/repo"],
        ["http://example.com/", "http://example.com/"],
        [
            "https://github.com/owner/project#readme",
            "https://github.com/owner/project#readme",
        ],
    ])("accepts %p", (input, expected) => {
        expect(toHttpUrl(input)).toBe(expected);
    });

    it.each([
        "javascript:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "file:///etc/passwd",
        "git://github.com/owner/repo",
        "owner/repo",
        "",
        undefined,
    ])("rejects %p", (input) => {
        expect(toHttpUrl(input)).toBeUndefined();
    });
});

describe("bareDomainToHttpsUrl", () => {
    it.each([
        ["example.com", "https://example.com/"],
        [
            "www.example.com/docs?page=1#top",
            "https://www.example.com/docs?page=1#top",
        ],
        ["example.com:8080/path", "https://example.com:8080/path"],
        ["example.com/docs/readme.md", "https://example.com/docs/readme.md"],
    ])("assumes https for %p", (input, expected) => {
        expect(bareDomainToHttpsUrl(input)).toBe(expected);
    });

    it.each([
        "https://example.com",
        "javascript:alert(1)",
        "owner/repo",
        "example",
        "1.2.3",
        "README.md",
        "index.js",
        "package.json",
        "example.com with spaces",
        "",
        undefined,
    ])("rejects %p", (input) => {
        expect(bareDomainToHttpsUrl(input)).toBeUndefined();
    });
});
