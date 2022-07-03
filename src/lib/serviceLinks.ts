export const serviceLinks = Object.freeze({
    "npmjs.com": (packageName: string, packageVersion: string) =>
        `https://www.npmjs.com/package/${packageName}/v/${packageVersion}` as const,
    UNPKG: (packageName: string | null, packageVersion: string, path = "") =>
        `https://unpkg.com/browse/${packageName}@${packageVersion}/${path}` as const,
    Packagephobia: (packageName: string, packageVersion: string) =>
        `https://packagephobia.com/result?p=${packageName}@${packageVersion}` as const,
    Bundlephobia: (packageName: string, packageVersion: string) =>
        `https://bundlephobia.com/package/${packageName}@${packageVersion}/` as const,
});
