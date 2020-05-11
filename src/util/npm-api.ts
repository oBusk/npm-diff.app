import { NpmManifest } from "interfaces/NpmManifest";
import tar from "tar-stream";
import { createGunzip } from "zlib";

const { NPM_REGISTRY_URL = "https://registry.npmjs.com" } = process.env;

/**
 * Escape an npm package name.
 * The registry expects the slashes in the (scoped) package names
 * to be sent escaped.
 */
function escapePackageName(name: string): string {
    return name.replace(/\//g, "%2f");
}

/**
 * Make an API call to npm to get package manifest details
 * @param name The npm package name
 */
export async function fetchManifest(name: string): Promise<NpmManifest> {
    const encodedPackage = escapePackageName(name);
    const response = await fetch(`${NPM_REGISTRY_URL}/${encodedPackage}`);
    const manifest: NpmManifest = await response.json();
    if (
        response.status === 404 ||
        !manifest ||
        Object.keys(manifest).length === 0
    ) {
        throw new Error("Package not found");
    }
    if (manifest.time.unpublished) {
        throw new Error("Package was unpublished");
    }
    return manifest;
}

export async function fetchTarBall(
    tarballUrl: string,
): Promise<{ [fileName: string]: string }> {
    return new Promise((resolve) => {
        const extract = tar.extract();
        const files: { [fileName: string]: string } = {};

        extract.on("entry", function (header, stream, next) {
            // header is the tar header
            // stream is the content body (might be an empty stream)
            // call next when you are done with this entry

            const chunks: Buffer[] = [];
            stream.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
            });

            stream.on("end", function () {
                files[header.name] = Buffer.concat(chunks).toString();
                next(); // ready for next entry
            });

            stream.resume(); // just auto drain the stream
        });

        extract.on("finish", function () {
            // all entries read

            resolve(files);
        });

        console.log(`Fetching ${tarballUrl}`);

        fetch(tarballUrl).then((response) => {
            (response.body as any).pipe(createGunzip()).pipe(extract as any);
        });
    });
}
