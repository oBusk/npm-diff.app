import { fromUrl } from "hosted-git-info";
import getPackageVersions from "^/lib/api/packageVersions/packageVersions";
import { toHttpUrl } from "^/lib/utils/toHttpUrl";
import fetchLatestManifest from "./latestManifest";
import type { Manifest } from "./packument";

export interface CatalogSummary {
    name: string;
    versions: string[];
    latest?: CatalogLatestVersion;
}

export interface CatalogLatestVersion {
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

const asString = (value: unknown): string | undefined =>
    typeof value === "string" ? value : undefined;

const asStrings = (value: unknown): string[] =>
    Array.isArray(value)
        ? [...new Set(value.filter((item) => typeof item === "string"))]
        : [];

export function licenseText({
    license,
    licenses,
}: Pick<Manifest, "license" | "licenses">): string | undefined {
    if (typeof license === "string") {
        return license;
    }
    const type = asString(license?.type);
    if (type) {
        return type;
    }
    const types = Array.isArray(licenses)
        ? licenses.map((entry) => asString(entry?.type)).filter(Boolean)
        : [];
    return types.length ? types.join(" OR ") : undefined;
}

export function authorName(author: Manifest["author"]): string | undefined {
    if (typeof author === "string") {
        return author.match(/^[^(<]+/)?.[0].trim() || undefined;
    }
    return asString(author?.name);
}

export function repositoryUrl(
    repository: Manifest["repository"],
): string | undefined {
    const url =
        typeof repository === "string" ? repository : asString(repository?.url);
    if (!url) {
        return undefined;
    }
    return (
        fromUrl(url)?.browse() ??
        toHttpUrl(url.replace(/^git\+/, "").replace(/\.git$/, ""))
    );
}

export interface CatalogSource {
    name: string;
    versions: Record<string, string>;
    latestManifest: Manifest | null;
}

export function createCatalogSummary({
    name,
    versions,
    latestManifest: manifest,
}: CatalogSource): CatalogSummary {
    const versionList = Object.keys(versions);

    if (!manifest) {
        return { name, versions: versionList };
    }

    return {
        name,
        versions: versionList,
        latest: {
            version: manifest.version,
            time: versions[manifest.version],
            description: asString(manifest.description),
            license: licenseText(manifest),
            author: authorName(manifest.author),
            repositoryUrl: repositoryUrl(manifest.repository),
            homepageUrl: toHttpUrl(asString(manifest.homepage)),
            keywords: asStrings(manifest.keywords),
            maintainersCount: Array.isArray(manifest.maintainers)
                ? manifest.maintainers.length
                : 0,
        },
    };
}

export default async function getCatalogSummary(
    packageName: string,
): Promise<CatalogSummary> {
    const latestManifest = await fetchLatestManifest(packageName);
    const packageVersions = await getPackageVersions(
        packageName,
        latestManifest?.version,
    );

    if (!packageVersions) {
        throw new Error(`Package not found: ${packageName}`);
    }

    return createCatalogSummary({
        name: packageName,
        versions: packageVersions.versions,
        latestManifest,
    });
}
