import { liteClient, type SearchParamsObject } from "algoliasearch/lite";
import getAlgoliaConfig from "./algoliaConfig";

let client: ReturnType<typeof liteClient> | undefined;

function getClient() {
    if (!client) {
        const { appId, apiKey } = getAlgoliaConfig();
        client = liteClient(appId, apiKey);
    }

    return client;
}

export default async function searchNpmSearch<T>(
    params: SearchParamsObject,
): Promise<T[]> {
    const { indexName } = getAlgoliaConfig();

    const { results } = await getClient().searchForHits<T>({
        requests: [{ indexName, ...params }],
    });

    const [{ hits }] = results;

    return hits;
}
