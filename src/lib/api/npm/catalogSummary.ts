import { fromUrl } from "hosted-git-info";
import { toHttpUrl } from "^/lib/utils/toHttpUrl";

export const MAX_CATALOG_KEYWORDS = 10;

interface LegacyLicense {
    type?: string;
    url?: string;
}

type PackagePerson = string | { name?: string; email?: string; url?: string };

type PackageRepository = string | { type?: string; url?: string };

export interface CatalogManifest {
    description?: string;
    license?: string | LegacyLicense;
    licenses?: LegacyLicense[];
    author?: PackagePerson;
    repository?: PackageRepository;
    homepage?: string;
    keywords?: string[];
    maintainers?: unknown[];
}

export interface CatalogPackument {
    name: string;
    "dist-tags": Record<string, string>;
    time?: Record<string, string>;
    versions: Record<string, CatalogManifest>;
}

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

export function licenseText({
    license,
    licenses,
}: Pick<CatalogManifest, "license" | "licenses">): string | undefined {
    if (typeof license === "string") {
        return license;
    }
    if (license?.type) {
        return license.type;
    }
    const types = licenses?.map(({ type }) => type).filter(Boolean);
    return types?.length ? types.join(" OR ") : undefined;
}

export function authorName(author: PackagePerson | undefined) {
    if (typeof author === "string") {
        return author.match(/^[^(<]+/)?.[0].trim() || undefined;
    }
    return author?.name;
}

export function repositoryUrl(repository: PackageRepository | undefined) {
    const url = typeof repository === "string" ? repository : repository?.url;
    if (!url) {
        return undefined;
    }
    return (
        fromUrl(url)?.browse() ??
        toHttpUrl(url.replace(/^git\+/, "").replace(/\.git$/, ""))
    );
}

export function summarizePackument(
    packument: CatalogPackument,
): CatalogSummary {
    const versions = Object.keys(packument.versions);
    const latestVersion = packument["dist-tags"].latest;
    const manifest = packument.versions[latestVersion];

    if (!manifest) {
        return { name: packument.name, versions };
    }

    return {
        name: packument.name,
        versions,
        latest: {
            version: latestVersion,
            time: packument.time?.[latestVersion],
            description: manifest.description,
            license: licenseText(manifest),
            author: authorName(manifest.author),
            repositoryUrl: repositoryUrl(manifest.repository),
            homepageUrl: toHttpUrl(manifest.homepage),
            keywords: Array.isArray(manifest.keywords)
                ? manifest.keywords.slice(0, MAX_CATALOG_KEYWORDS)
                : [],
            maintainersCount: manifest.maintainers?.length ?? 0,
        },
    };
}
