import type { Suggestion } from "^/lib/api/npmSearch/suggestions";
import type AutocompleteSuggestion from "./AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "./AutocompleteSuggestionTypes";

const packageSuggestion = ({
    name,
    description,
    highlight,
}: Suggestion): AutocompleteSuggestion => ({
    type: AutocompleteSuggestionTypes.Package,
    // @ suffix to start selecting version right away
    value: `${name}@`,
    name: highlight || name,
    body: description,
});

export default packageSuggestion;
