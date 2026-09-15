const AlgoliaConfig = {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
    indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!,
};

type AlgoliaConfig = typeof AlgoliaConfig;

if (!AlgoliaConfig.appId || !AlgoliaConfig.apiKey || !AlgoliaConfig.indexName) {
    throw new Error(
        "Algolia configuration is missing. Please set NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_API_KEY, and NEXT_PUBLIC_ALGOLIA_INDEX_NAME in your environment variables.",
    );
}

export default AlgoliaConfig;
