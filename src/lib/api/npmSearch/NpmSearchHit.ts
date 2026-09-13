/**
 * How the entries in the open algolia index called `npm-search`
 */
export default interface NpmSearchHit {
    objectID: string;
    name: string;
    description?: string;
    popular?: boolean;
    downloadsLast30Days?: number;
    _highlightResult?: {
        name?: {
            value: string;
        };
    };
}
