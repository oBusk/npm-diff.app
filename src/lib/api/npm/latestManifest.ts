import npa from "npm-package-arg";
import { USER_AGENT } from "../user-agent";
import type { Manifest } from "./packument";

const TIMEOUT_MS = 10_000;

export default async function fetchLatestManifest(
    packageName: string,
): Promise<Manifest> {
    const { escapedName } = npa(packageName);

    const response = await fetch(
        `https://registry.npmjs.org/${escapedName}/latest`,
        {
            headers: { "User-Agent": USER_AGENT },
            cache: "no-store",
            signal: AbortSignal.timeout(TIMEOUT_MS),
        },
    );

    if (!response.ok) {
        await response.body?.cancel();

        throw Object.assign(
            new Error(
                `[${packageName}] Registry returned ${response.status} for the latest manifest`,
            ),
            { code: `E${response.status}` },
        );
    }

    return response.json();
}
