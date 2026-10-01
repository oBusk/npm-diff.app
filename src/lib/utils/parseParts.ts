import versionsToSpecs from "^/lib/destination/versionsToSpecs";
import decodeParts from "./decodeParts";
import { isCatalogPage } from "./isCatalogPage";
import splitParts from "./splitParts";
import validateSpecs from "./validateSpecs";

export default function parseParts(
    parts: string | string[] | undefined,
    { decode = false }: { decode?: boolean } = {},
): [string] | [string, string] | null {
    try {
        const specsOrVersions = splitParts(decode ? decodeParts(parts) : parts);

        if (!validateSpecs(specsOrVersions)) {
            return null;
        }

        // Bare names like `x` or `1` are also semver ranges, which
        // versionsToSpecs rejects, but they are valid catalog pages.
        if (!isCatalogPage(specsOrVersions)) {
            versionsToSpecs(specsOrVersions);
        }

        return specsOrVersions;
    } catch {
        return null;
    }
}
