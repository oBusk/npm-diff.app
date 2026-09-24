export function toHttpUrl(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    try {
        const url = new URL(value.trim());
        return url.protocol === "http:" || url.protocol === "https:"
            ? url.href
            : undefined;
    } catch {
        return undefined;
    }
}
