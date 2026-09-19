import { liteClient, type Hit, type SearchParamsObject } from "algoliasearch/lite";

const algoliaConfig = {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
    indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
};

let client: ReturnType<typeof liteClient> | undefined;

export default async function searchNpmSearch<T>(
    params: SearchParamsObject,
): Promise<Hit<T>[]> {
    const { appId, apiKey, indexName } = algoliaConfig;

    if (!appId || !apiKey || !indexName) {
        throw new Error(
            "Algolia configuration is missing. Please set NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_API_KEY, and NEXT_PUBLIC_ALGOLIA_INDEX_NAME in your environment variables.",
        );
    }

    if (!client) {
        client = liteClient(appId, apiKey);
    }

    const { results } = await client.searchForHits<T>({
        requests: [{ indexName, ...params }],
    });

    return results[0]?.hits ?? [];
}
