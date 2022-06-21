import { useEffect } from "react";
import useThrottle from "^/lib/hooks/useThrottle";
import useAsyncState from "../hooks/useAsyncState";
import autocomplete from "./autocomplete";
import AutocompleteSuggestion from "./AutocompleteSuggestion";

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
    isLoading: boolean;
}

function useAutocomplete({
    fallback = [],
    query,
    queryThrottle = 0,
    optionalPackageFilter,
}: UseAutocompleteProps): UseAutocompleteState {
    const throttledQuery = useThrottle(query, queryThrottle);

    const [state, setState] = useAsyncState<UseAutocompleteState>({
        items: fallback,
        isLoading: false,
    });

    useEffect(() => {
        // Update synchronously to set isLoading
        setState(({ items }) => ({ items, isLoading: true }));
        // Update asynchronously to set items and isLoading = false
        setState(
            throttledQuery === ""
                ? {
                      items: fallback,
                      isLoading: false,
                  }
                : autocomplete({
                      query: throttledQuery,
                      optionalPackageFilter,
                  }).then((items) => ({ items, isLoading: false })),
        );
    }, [setState, throttledQuery, fallback, optionalPackageFilter]);

    return state;
}

export default useAutocomplete;
