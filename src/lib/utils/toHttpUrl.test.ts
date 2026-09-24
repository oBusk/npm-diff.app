import { toHttpUrl } from "./toHttpUrl";

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
