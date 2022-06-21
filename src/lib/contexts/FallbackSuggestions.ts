import { createContext } from "react";
import { AutocompleteSuggestion } from "^/lib/autocomplete";

export const FallbackSuggestionsContext = createContext<
    AutocompleteSuggestion[]
>([]);
