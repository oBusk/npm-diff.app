import type { Hit } from "algoliasearch";

export interface NpmSearchRecord {
    name: string;
    description?: string;
    popular?: boolean;
    downloadsLast30Days?: number;
    /** Map of version to ISO publish date */
    versions?: Record<string, string>;
    /** Map of dist-tag to version */
    tags?: Record<string, string>;
}

type NpmSearchHit = Hit<NpmSearchRecord>;

export default NpmSearchHit;
