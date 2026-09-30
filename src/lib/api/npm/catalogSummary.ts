import { fromUrl } from "hosted-git-info";
import getPackageVersions from "^/lib/api/packageVersions/packageVersions";
import { toHttpUrl } from "^/lib/utils/toHttpUrl";
import fetchLatestManifest from "./latestManifest";
import type { Manifest } from "./packument";

export interface CatalogSummary {
    name: string;
    versions: string[];
    latest?: CatalogLatestVersion;
    latestUnavailable?: true;
}

export interface CatalogLink {
    text: string;
    href?: string;
}

export type CatalogRepositoryHost = "github" | "gitlab";

export interface CatalogRepository extends CatalogLink {
    host?: CatalogRepositoryHost;
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

function webUrl(value: string): string | undefined {
    const href = toHttpUrl(value);
    if (!href) {
        return undefined;
    }
    const { username, password } = new URL(href);
    return username || password ? undefined : href;
}

const displayUrl = (href: string): string =>
    href.replace(/^https:\/\//, "").replace(/^([^/?#]+)\/$/, "$1");

function comparableUrl(href: string): string {
    const { host, pathname } = new URL(href);
    return `${host}${pathname.replace(/\/+$/, "").replace(/\.git$/, "")}`.toLowerCase();
}

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
    const host =
        hosted.type === "github" || hosted.type === "gitlab"
            ? hosted.type
            : undefined;
    const repositoryPage = hosted.browse();
    const text = host
        ? [hosted.user, hosted.project].join("/")
        : displayUrl(repositoryPage);
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
    const page = toHttpUrl(url)
        ?.replace(/[?#].*$/, "")
        .replace(/\/+$/, "");
    if (page?.startsWith(`${repositoryPage}/`)) {
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
    repository?: CatalogRepository,
): CatalogLink | undefined {
    const value = asString(homepage)?.trim();
    if (!value) {
        return undefined;
    }
    const href = webUrl(value);
    if (!href) {
        return { text: value };
    }
    if (
        repository?.href &&
        comparableUrl(repository.href) === comparableUrl(href)
    ) {
        return undefined;
    }
    return { text: displayUrl(href), href };
}

export interface CatalogSource {
    name: string;
    versions: Record<string, string | undefined>;
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

    const repository = repositoryLink(manifest.repository);

    return {
        name,
        versions: versionList,
        latest: {
            version: manifest.version,
            time: versions[manifest.version],
            description: asString(manifest.description),
            license: licenseText(manifest),
            author: authorName(manifest.author),
            repository,
            homepage: homepageLink(manifest.homepage, repository),
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
    const latest = fetchLatestManifest(packageName).then(
        (manifest) => ({ manifest, unavailable: false }),
        (e) => {
            console.error(`[${packageName}] latest manifest error:`, e);

            return { manifest: null, unavailable: true };
        },
    );

    const [{ manifest, unavailable }, packageVersions] = await Promise.all([
        latest,
        getPackageVersions(
            packageName,
            latest.then(({ manifest }) => asString(manifest?.version)),
        ),
    ]);

    if (!packageVersions) {
        throw new Error(`Package not found: ${packageName}`);
    }

    return {
        ...createCatalogSummary({
            name: packageName,
            versions: packageVersions.versions,
            latestManifest: manifest,
        }),
        ...(unavailable && { latestUnavailable: true }),
    };
}
