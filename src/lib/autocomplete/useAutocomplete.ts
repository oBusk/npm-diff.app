import { useAsync } from "react-use";
import useThrottle from "^/lib/utils/useThrottle";
import autocomplete from "./autocomplete";
import type AutocompleteSuggestion from "./AutocompleteSuggestion";

export interface UseAutocompleteProps {
    query: string;
    /**
     * If specified, will only perform api requests at most every
     * `queryThrottle` ms.
     */
    queryThrottle?: number;
    fallback?: AutocompleteSuggestion[];
    optionalPackageFilter?: string;
}

export interface UseAutocompleteState {
    items: AutocompleteSuggestion[];
    loading: boolean;
    error: Error | undefined;
}

function useAutocomplete({
    fallback = [],
    query,
    queryThrottle = 0,
    optionalPackageFilter,
}: UseAutocompleteProps) {
    const throttledQuery = useThrottle(query, queryThrottle);

    const { loading, value, error } = useAsync(
        async () =>
            throttledQuery === ""
                ? fallback
                : await autocomplete({
                      query: throttledQuery ?? "",
                      optionalPackageFilter,
                  }),
        [throttledQuery, fallback, optionalPackageFilter],
    );

    return {
        items: value ?? fallback,
        loading,
        error,
    };
}

export default useAutocomplete;
