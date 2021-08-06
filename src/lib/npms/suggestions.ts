import Result from "./Result";
import { searchUrl } from "./search";

// https://api-docs.npms.io/
export interface Suggestion extends Result {
    /** A string containing highlighted matched text */
    highlight?: string;
}

export type Suggestions = Suggestion[];

// https://github.com/pastelsky/bundlephobia/blob/b4075b/client/api.js#L65-L79
const suggestionSort = (suggestionA: Suggestion, suggestionB: Suggestion) => {
    // Rank closely matching packages followed
    // by most popular ones
    if (
        Math.abs(
            Math.log(suggestionB.searchScore) -
                Math.log(suggestionA.searchScore),
        ) > 1
    ) {
        return suggestionB.searchScore - suggestionA.searchScore;
    } else {
        return (
            suggestionB.score.detail.popularity -
            suggestionA.score.detail.popularity
        );
    }
};

export const suggestionsUrl = `${searchUrl}/suggestions` as const;

export default async function suggestions(
    query: string,
    size = 25,
): Promise<string[]> {
    const url = `${suggestionsUrl}?q=${query}&size=${size}` as const;
    const response = await fetch(url);
    const json: Suggestions = await response.json();
    const sorted = json.sort(suggestionSort);
    const packageNames = sorted.map((suggestion) => suggestion.package.name);

    return packageNames;
}
