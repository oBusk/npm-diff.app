import { Version } from "^/lib/middleware";

export interface Matched {
    version: string;
    tags?: string[];
}

const emphasize = (fullStr: string, subStr?: string) =>
    subStr?.length
        ? fullStr.replace(new RegExp(subStr), `<em>${subStr}</em>`)
        : fullStr;

/**
 * Takes input parameters and and source and returns a subset of the source.
 */
export function matchVersions({
    rawSpec,
    versions,
    size,
}: {
    /** from `npa`. Like `1`, `1.2` or `1.2.3` */
    rawSpec: string;
    versions: ReadonlyArray<Version>;
    size: number;
}): Matched[] {
    versions = [...versions].reverse();

    const matches: Matched[] = [];
    for (const { version, tags } of versions) {
        if (matches.length >= size) {
            break;
        }

        if (version.startsWith(rawSpec)) {
            // Matched version number (name?)
            matches.push({
                version: emphasize(version, rawSpec),
                ...(tags ? { tags } : undefined),
            });
        } else if (tags?.length) {
            // Matched tag
            const matchIndex = tags.findIndex((tag) => tag.includes(rawSpec));
            if (matchIndex !== -1) {
                matches.push({
                    version,
                    tags: tags.map((tag, index) =>
                        index === matchIndex ? emphasize(tag, rawSpec) : tag,
                    ),
                });
            }
        }
    }
    return matches;
}
