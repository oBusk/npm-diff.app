export interface AlgoliaConfig {
    appId: string;
    apiKey: string;
    indexName: string;
}

function required(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(
            `Missing required environment variable "${name}" for Algolia search. See README.md.`,
        );
    }

    return value;
}

let config: AlgoliaConfig | undefined;

function getAlgoliaConfig(): AlgoliaConfig {
    return (config ??= {
        appId: required(
            "NEXT_PUBLIC_ALGOLIA_APP_ID",
            process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        ),
        apiKey: required(
            "NEXT_PUBLIC_ALGOLIA_API_KEY",
            process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
        ),
        indexName: required(
            "NEXT_PUBLIC_ALGOLIA_INDEX_NAME",
            process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
        ),
    });
}

export default getAlgoliaConfig;
