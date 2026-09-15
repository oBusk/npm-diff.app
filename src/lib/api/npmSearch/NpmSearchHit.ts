/**
 * How the entries in the open algolia index called `npm-search`
 */
export default interface NpmSearchHit {
    objectID: string;
    name: string;
    description?: string;
    popular?: boolean;
    downloadsLast30Days?: number;
    /** Map of version to ISO publish date */
    versions?: Record<string, string>;
    /** Map of dist-tag to version */
    tags?: Record<string, string>;
    _highlightResult?: {
        name?: {
            value: string;
        };
    };
}
