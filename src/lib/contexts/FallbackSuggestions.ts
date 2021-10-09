import { createContext } from "react";
import AutocompleteSuggestion from "-/lib/autocomplete/AutocompleteSuggestion";

export const FallbackSuggestionsContext = createContext<
    AutocompleteSuggestion[]
>([]);
