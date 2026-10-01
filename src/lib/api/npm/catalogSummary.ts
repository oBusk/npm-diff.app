import { fromUrl } from "hosted-git-info";
import getPackageVersions from "^/lib/api/packageVersions";
import { hasErrorCode } from "^/lib/utils/hasErrorCode";
import fetchManifest from "./manifest";
import type { Manifest } from "./packument";

export interface CatalogSummary {
    name: string;
    versions: string[];
    latest?: CatalogLatestVersion;
}

export interface CatalogLink {
    text: string;
    href: string;
}

export interface CatalogRepository extends CatalogLink {
    host: string;
    directory?: string;
}

export interface CatalogLatestVersion {
    version: string;
    time?: string;
    description?: string;
    license?: string;
    author?: string;
    repository?: CatalogRepository;
    homepage?: CatalogLink;
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

const displayUrl = (href: string): string =>
    href.replace(/^https:\/\//, "").replace(/^([^/?#]+)\/$/, "$1");

export function repositoryLink(
    repository: Manifest["repository"],
): CatalogRepository | undefined {
    const url = (
        typeof repository === "string" ? repository : asString(repository?.url)
    )?.trim();
    const hosted = url ? fromUrl(url) : undefined;
    if (!hosted) {
        return undefined;
    }
    const directory =
        typeof repository === "string"
            ? undefined
            : asString(repository?.directory) || undefined;
    return {
        host: hosted.type,
        text: [hosted.user, hosted.project].filter(Boolean).join("/"),
        directory,
        href: directory ? hosted.browse(directory) : hosted.browse(),
    };
}

export function homepageLink(
    homepage: Manifest["homepage"],
): CatalogLink | undefined {
    const href = asString(homepage)?.trim();
    return href && /^https?:\/\//i.test(href)
        ? { text: displayUrl(href), href }
        : undefined;
}

export default async function getCatalogSummary(
    packageName: string,
): Promise<CatalogSummary & { cacheLife: "minutes" | "hours" }> {
    const manifest = await fetchManifest(packageName, "latest").catch(
        (e: unknown) => {
            if (hasErrorCode(e, "E404")) {
                throw new Error(`Package not found: ${packageName}`);
            }

            console.error(`[${packageName}] latest manifest error:`, e);

            return null;
        },
    );
    const versions = await getPackageVersions(packageName, manifest?.version);

    if (!versions) {
        throw new Error(`Package not found: ${packageName}`);
    }

    return {
        name: packageName,
        versions: Object.keys(versions),
        latest: manifest
            ? {
                  version: manifest.version,
                  time: versions[manifest.version],
                  description: asString(manifest.description),
                  license: licenseText(manifest),
                  author: authorName(manifest.author),
                  repository: repositoryLink(manifest.repository),
                  homepage: homepageLink(manifest.homepage),
                  keywords: asStrings(manifest.keywords),
                  maintainersCount: Array.isArray(manifest.maintainers)
                      ? manifest.maintainers.length
                      : 0,
              }
            : undefined,
        cacheLife:
            manifest && Object.hasOwn(versions, manifest.version)
                ? "hours"
                : "minutes",
    };
}
