import { fromUrl } from "hosted-git-info";
import { cacheLife } from "next/cache";
import { packument } from "pacote";
import { toHttpUrl } from "^/lib/utils/toHttpUrl";
import type { Manifest, Packument } from "./packument";

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

export function licenseText({
    license,
    licenses,
}: Pick<Manifest, "license" | "licenses">): string | undefined {
    if (typeof license === "string") {
        return license;
    }
    if (license?.type) {
        return license.type;
    }
    const types = licenses?.map(({ type }) => type).filter(Boolean);
    return types?.length ? types.join(" OR ") : undefined;
}

export function authorName(author: Manifest["author"]): string | undefined {
    if (typeof author === "string") {
        return author.match(/^[^(<]+/)?.[0].trim() || undefined;
    }
    return author?.name;
}

export function repositoryUrl(
    repository: Manifest["repository"],
): string | undefined {
    const url = typeof repository === "string" ? repository : repository?.url;
    if (!url) {
        return undefined;
    }
    return (
        fromUrl(url)?.browse() ??
        toHttpUrl(url.replace(/^git\+/, "").replace(/\.git$/, ""))
    );
}

export function createCatalogSummary(packument: Packument): CatalogSummary {
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
            keywords: Array.isArray(manifest.keywords) ? manifest.keywords : [],
            maintainersCount: manifest.maintainers?.length ?? 0,
        },
    };
}

export default async function getCatalogSummary(
    packageName: string,
): Promise<CatalogSummary> {
    "use cache";

    cacheLife("hours");

    const fullPackument = (await packument(packageName, {
        fullMetadata: true,
    })) as Packument;

    return createCatalogSummary(fullPackument);
}
