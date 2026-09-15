import { liteClient, type SearchParamsObject } from "algoliasearch/lite";
import AlgoliaConfig from "./AlgoliaConfig";

let client: ReturnType<typeof liteClient> | undefined;

function getClient() {
    if (!client) {
        const { appId, apiKey } = AlgoliaConfig;
        client = liteClient(appId, apiKey);
    }

    return client;
}

export default async function searchNpmSearch<T>(
    params: SearchParamsObject,
): Promise<T[]> {
    const { indexName } = AlgoliaConfig;

    const { results } = await getClient().searchForHits<T>({
        requests: [{ indexName, ...params }],
    });

    const [{ hits }] = results;

    return hits;
}
