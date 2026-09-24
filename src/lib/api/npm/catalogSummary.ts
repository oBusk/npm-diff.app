import { toHttpUrl } from "^/lib/utils/toHttpUrl";

export const MAX_CATALOG_KEYWORDS = 10;

export interface CatalogLatestSummary {
    version: string;
    time?: string;
    description?: string;
    license?: string;
    author?: string;
    repositoryUrl?: string;
    homepageUrl?: string;
    keywords: string[];
    maintainersCount: number;
}

export interface CatalogSummary {
    name: string;
    versions: string[];
    latest?: CatalogLatestSummary;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizeLicense(license: unknown): string | undefined {
    if (Array.isArray(license)) {
        const types = license
            .map(normalizeLicense)
            .filter((type): type is string => type != null);
        return types.length > 0 ? types.join(" OR ") : undefined;
    }
    if (isRecord(license)) {
        return nonEmptyString(license.type);
    }
    return nonEmptyString(license);
}

export function normalizeAuthor(author: unknown): string | undefined {
    if (isRecord(author)) {
        return nonEmptyString(author.name);
    }
    return nonEmptyString(author);
}

export function normalizeKeywords(keywords: unknown): string[] {
    const list =
        typeof keywords === "string"
            ? keywords.split(/[\s,]+/)
            : Array.isArray(keywords)
              ? keywords
              : [];

    const unique = new Set<string>();
    for (const keyword of list) {
        const value = nonEmptyString(keyword);
        if (value) {
            unique.add(value);
        }
        if (unique.size >= MAX_CATALOG_KEYWORDS) {
            break;
        }
    }
    return [...unique];
}

export function normalizeRepositoryUrl(
    repository: unknown,
): string | undefined {
    const url = isRecord(repository) ? repository.url : repository;
    if (typeof url !== "string") {
        return undefined;
    }
    return toHttpUrl(
        url
            .trim()
            .replace(/^git\+/, "")
            .replace(/\.git$/, ""),
    );
}

export function summarizePackument(packument: unknown): CatalogSummary {
    if (!isRecord(packument) || typeof packument.name !== "string") {
        throw new Error("Invalid packument");
    }

    const versionsRecord = isRecord(packument.versions)
        ? packument.versions
        : {};
    const versions = Object.keys(versionsRecord);

    const distTags = isRecord(packument["dist-tags"])
        ? packument["dist-tags"]
        : {};
    const latestVersion = distTags.latest;
    const latestManifest =
        typeof latestVersion === "string"
            ? versionsRecord[latestVersion]
            : undefined;

    if (typeof latestVersion !== "string" || !isRecord(latestManifest)) {
        return { name: packument.name, versions };
    }

    const time = isRecord(packument.time)
        ? nonEmptyString(packument.time[latestVersion])
        : undefined;

    return {
        name: packument.name,
        versions,
        latest: {
            version: latestVersion,
            time,
            description: nonEmptyString(latestManifest.description),
            license: normalizeLicense(latestManifest.license),
            author: normalizeAuthor(latestManifest.author),
            repositoryUrl: normalizeRepositoryUrl(latestManifest.repository),
            homepageUrl: toHttpUrl(latestManifest.homepage),
            keywords: normalizeKeywords(latestManifest.keywords),
            maintainersCount: Array.isArray(latestManifest.maintainers)
                ? latestManifest.maintainers.length
                : 0,
        },
    };
}
