import NpmsApiUrl from "./NpmsApiUrl";
import Result from "./Result";

export interface SearchResults {
    total: number;
    results: Result[];
}

export const searchUrl = `${NpmsApiUrl}/search` as const;

export default async function search(query: string): Promise<SearchResults> {
    const url = `${searchUrl}?q=${query}` as const;
    const response = await fetch(url);
    const result: SearchResults = await response.json();

    return result;
}
