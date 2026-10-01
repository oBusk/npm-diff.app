import { cacheLife } from "next/cache";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import fetchManifest from "../manifest";
import { getSourceFromManifest } from "./getSourceFromManifest";
import { type SourceLookup } from "./sourceInformation";

/** Cached until the next deploy, so `spec.version` must be an exact version, not a dist-tag */
export async function getSourceInformation(
    spec: SimplePackageSpec,
): Promise<SourceLookup> {
    "use cache: remote";

    try {
        const manifest = await fetchManifest(spec.name, spec.version);
        const sourceInformation = await getSourceFromManifest(manifest);

        cacheLife("max");

        return sourceInformation
            ? { status: "found", sourceInformation }
            : { status: "none" };
    } catch (e) {
        console.error(
            `[${simplePackageSpecToString(spec)}] Failed to get source information:`,
            e,
        );

        cacheLife("minutes");

        return { status: "undetermined" };
    }
}
