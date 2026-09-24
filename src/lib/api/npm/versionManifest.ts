import { cacheLife } from "next/cache";
import npa from "npm-package-arg";
import { USER_AGENT } from "../user-agent";
import type { Manifest } from "./packument";

export function versionManifestUrl(name: string, version: string): string {
    const { escapedName } = npa(name);

    if (!escapedName) {
        throw new Error(`Could not extract package name from: ${name}`);
    }

    return `https://registry.npmjs.org/${escapedName}/${encodeURIComponent(version)}`;
}

export default async function versionManifest(
    name: string,
    version: string,
): Promise<Manifest | null> {
    "use cache";

    const response = await fetch(versionManifestUrl(name, version), {
        signal: AbortSignal.timeout(7_500),
        headers: {
            Accept: "application/json",
            "User-Agent": USER_AGENT,
        },
        cache: "no-store",
    });

    if (response.status === 404) {
        cacheLife("hours");

        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Failed to fetch manifest for ${name}@${version}: ${response.status} ${response.statusText}`,
        );
    }

    const manifest: Manifest = await response.json();

    cacheLife("max");

    return manifest;
}
