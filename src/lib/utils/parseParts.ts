import versionsToSpecs from "^/lib/destination/versionsToSpecs";
import decodeParts from "./decodeParts";
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

        versionsToSpecs(specsOrVersions);

        return specsOrVersions;
    } catch {
        return null;
    }
}
