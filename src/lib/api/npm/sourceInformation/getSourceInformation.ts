import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import packument from "../packument";
import { getSourceFromManifest } from "./getSourceFromManifest";
import { type SourceInformation } from "./sourceInformation";

export async function getSourceInformation(
    spec: SimplePackageSpec,
): Promise<null | SourceInformation> {
    const pack = await packument(simplePackageSpecToString(spec));

    const manifest = pack.versions[spec.version];
    if (!manifest) {
        return null;
    }

    const sourceInformation = await getSourceFromManifest(manifest);

    return sourceInformation || null;
}
