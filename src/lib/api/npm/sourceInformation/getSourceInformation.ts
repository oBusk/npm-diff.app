import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import versionManifest from "../versionManifest";
import { getSourceFromManifest } from "./getSourceFromManifest";
import { type SourceLookup } from "./sourceInformation";

export async function getSourceInformation(
    spec: SimplePackageSpec,
): Promise<SourceLookup> {
    try {
        const manifest = await versionManifest(spec.name, spec.version);
        if (!manifest) {
            return { status: "none" };
        }

        const sourceInformation = await getSourceFromManifest(manifest);

        return sourceInformation
            ? { status: "found", sourceInformation }
            : { status: "none" };
    } catch (e) {
        console.error(
            `[${simplePackageSpecToString(spec)}] Failed to get source information:`,
            e,
        );

        return { status: "undetermined" };
    }
}
