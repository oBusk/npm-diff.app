export function toHttpUrl(value: string | undefined): string | undefined {
    if (!value) {
        return undefined;
    }

    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:"
            ? url.href
            : undefined;
    } catch {
        return undefined;
    }
}

const BARE_DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(:\d+)?([/?#]\S*)?$/i;

const FILE_NAME =
    /^[^/]+\.(md|markdown|txt|js|mjs|cjs|ts|json|html?|css|ya?ml|xml|php|py|sh|zip)$/i;

export function bareDomainToHttpsUrl(
    value: string | undefined,
): string | undefined {
    return value && BARE_DOMAIN.test(value) && !FILE_NAME.test(value)
        ? toHttpUrl(`https://${value}`)
        : undefined;
}
