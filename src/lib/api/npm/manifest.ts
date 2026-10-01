import npa from "npm-package-arg";
import { USER_AGENT } from "../user-agent";
import type { Manifest } from "./packument";

export default async function fetchManifest(
    packageName: string,
    versionOrTag: string,
): Promise<Manifest> {
    const { escapedName } = npa(packageName);

    const response = await fetch(
        `https://registry.npmjs.org/${escapedName}/${encodeURIComponent(versionOrTag)}`,
        {
            headers: { "User-Agent": USER_AGENT },
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        },
    );

    if (!response.ok) {
        await response.body?.cancel();

        throw Object.assign(
            new Error(
                `[${packageName}@${versionOrTag}] Registry returned ${response.status} for the manifest`,
            ),
            { code: `E${response.status}` },
        );
    }

    return response.json();
}
