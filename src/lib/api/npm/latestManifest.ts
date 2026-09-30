import npa from "npm-package-arg";
import { USER_AGENT } from "../user-agent";
import type { Manifest } from "./packument";

const TIMEOUT_MS = 10_000;

async function requestLatestManifest(
    packageName: string,
): Promise<Manifest | null> {
    const { escapedName } = npa(packageName);

    const response = await fetch(
        `https://registry.npmjs.org/${escapedName}/latest`,
        {
            headers: { "User-Agent": USER_AGENT },
            cache: "no-store",
            signal: AbortSignal.timeout(TIMEOUT_MS),
        },
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `[${packageName}] Registry returned ${response.status} for the latest manifest`,
        );
    }

    return response.json();
}

export default async function fetchLatestManifest(
    packageName: string,
): Promise<Manifest | null> {
    try {
        return await requestLatestManifest(packageName);
    } catch {
        return requestLatestManifest(packageName);
    }
}
