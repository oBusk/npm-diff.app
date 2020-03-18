interface ManifestDist {
    integrity: string;
    shasum: string;
    tarball: string;
    fileCount: number;
    unpackedSize: number;
    "npm-signature": string;
}

interface ManifestVersion {
    [key: string]: any;
    dist: ManifestDist;
}

export interface NpmManifest {
    versions: { [version: string]: ManifestVersion };
    time: { [version: string]: string };
    "dist-tags": { [tag: string]: string };
}
