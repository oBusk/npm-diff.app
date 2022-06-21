import Result from "^/lib/api/npms/Result";
import { Suggestion } from "^/lib/api/npms/suggestions";
import AutocompleteSuggestion from "./AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "./AutocompleteSuggestionTypes";

const packageSuggestion = ({
    package: { name, description },
    highlight,
}: Result & Suggestion): AutocompleteSuggestion => ({
    type: AutocompleteSuggestionTypes.Package,
    // @ suffix to start selecting version right away
    value: `${name}@`,
    name: highlight || name,
    body: description,
});

export default packageSuggestion;
