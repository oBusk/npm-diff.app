import { fromUrl } from "hosted-git-info";
import getPackageVersions, {
    type PackageVersions,
} from "^/lib/api/packageVersions";
import fetchLatestManifest from "./latestManifest";
import type { Manifest } from "./packument";

export interface CatalogSummary {
    name: string;
    versions: string[];
    latest?: CatalogLatestVersion;
}

export interface CatalogLink {
    text: string;
    href?: string;
}

export interface CatalogRepository extends CatalogLink {
    host?: string;
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

function directoryPath(directory: unknown): string | undefined {
    const segments = (asString(directory) ?? "")
        .split("/")
        .filter((segment) => segment && segment !== ".");
    return segments.length > 0 && !segments.includes("..")
        ? segments.join("/")
        : undefined;
}

const encodePath = (path: string): string =>
    path.split("/").map(encodeURIComponent).join("/");

export function repositoryLink(
    repository: Manifest["repository"],
): CatalogRepository | undefined {
    const url = (
        typeof repository === "string" ? repository : asString(repository?.url)
    )?.trim();
    if (!url) {
        return undefined;
    }
    const hosted = fromUrl(url);
    if (!hosted) {
        return { text: url };
    }
    const host = hosted.type;
    const repositoryPage = hosted.browse();
    const text = [hosted.user, hosted.project].filter(Boolean).join("/");
    const directory =
        typeof repository === "string"
            ? undefined
            : directoryPath(repository?.directory);
    if (directory) {
        return {
            host,
            text,
            directory,
            href: hosted.browse(encodePath(directory)),
        };
    }
    const page = url.replace(/[?#].*$/, "").replace(/\/+$/, "");
    if (page.startsWith(`${repositoryPage}/`)) {
        return {
            host,
            text,
            directory: page.slice(repositoryPage.length + 1),
            href: page,
        };
    }
    return { host, text, href: repositoryPage };
}

export function homepageLink(
    homepage: Manifest["homepage"],
): CatalogLink | undefined {
    const value = asString(homepage)?.trim();
    if (!value) {
        return undefined;
    }
    return /^https?:\/\//i.test(value)
        ? { text: displayUrl(value), href: value }
        : { text: value };
}

export interface CatalogSource {
    name: string;
    versions: PackageVersions;
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
            repository: repositoryLink(manifest.repository),
            homepage: homepageLink(manifest.homepage),
            keywords: asStrings(manifest.keywords),
            maintainersCount: Array.isArray(manifest.maintainers)
                ? manifest.maintainers.length
                : 0,
        },
    };
}

export default async function getCatalogSummary(
    packageName: string,
): Promise<CatalogSummary & { cacheLife: "minutes" | "hours" }> {
    let cacheLife: "minutes" | "hours" = "hours";
    const manifest = await fetchLatestManifest(packageName).catch(
        (e: unknown) => {
            console.error(`[${packageName}] latest manifest error:`, e);
            cacheLife = "minutes";

            return null;
        },
    );
    const versions = await getPackageVersions(
        packageName,
        asString(manifest?.version),
    );

    if (!versions) {
        throw new Error(`Package not found: ${packageName}`);
    }

    return {
        ...createCatalogSummary({
            name: packageName,
            versions,
            latestManifest: manifest,
        }),
        cacheLife,
    };
}
