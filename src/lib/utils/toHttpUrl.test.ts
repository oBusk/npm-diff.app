import { toHttpUrl } from "./toHttpUrl";

describe("toHttpUrl", () => {
    it.each([
        ["https://github.com/owner/repo", "https://github.com/owner/repo"],
        ["http://example.com/", "http://example.com/"],
        [
            "  https://example.com/docs#readme ",
            "https://example.com/docs#readme",
        ],
        ["HTTPS://Example.com/path", "https://example.com/path"],
    ])("accepts %p", (input, expected) => {
        expect(toHttpUrl(input)).toBe(expected);
    });

    it.each([
        "javascript:alert(1)",
        "JavaScript:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "vbscript:msgbox(1)",
        "file:///etc/passwd",
        "git://github.com/owner/repo",
        "ssh://git@github.com/owner/repo",
        "github:owner/repo",
        "owner/repo",
        "//evil.example.com",
        "not a url",
        "",
    ])("rejects %p", (input) => {
        expect(toHttpUrl(input)).toBeUndefined();
    });

    it.each([undefined, null, 42, {}, ["https://example.com"]])(
        "rejects non-string %p",
        (input) => {
            expect(toHttpUrl(input)).toBeUndefined();
        },
    );
});
