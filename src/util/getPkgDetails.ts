import { NpmManifest } from "interfaces/NpmManifest";
import { fetchManifest } from "./npm-api";

export async function getPkgDetails(
    name: string,
    version: string | null,
): Promise<{ version: string; tarballUrl: string }> {
    let manifest: NpmManifest;
    let isLatest = false;

    try {
        manifest = await fetchManifest(name);
    } catch (e: unknown) {
        throw new Error(`Package ${name} does not exist in npm`);
    }

    const tagToVersion = manifest["dist-tags"];
    if (!version) {
        version = tagToVersion["latest"];
        isLatest = true;
    } else if (typeof tagToVersion[version] !== "undefined") {
        version = tagToVersion[version];
    }

    if (!manifest.versions[version]) {
        throw new Error(`Version ${name}@${version} does not exist in npm`);
    }

    const versionManifest = manifest.versions[version];
    const dist = versionManifest.dist;
    const tarballUrl = dist.tarball;

    const result = {
        version,
        tarballUrl,
    };
    return result;
}
