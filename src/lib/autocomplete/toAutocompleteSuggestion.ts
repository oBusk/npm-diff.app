import Result from "_/lib/api/npms/Result";
import { Suggestion } from "_/lib/api/npms/suggestions";
import AutocompleteSuggestion from "./AutocompleteSuggestion";

const toAutocompleteSuggestion = ({
    package: { name, description },
}: Result | Suggestion): AutocompleteSuggestion => ({
    name,
    description,
});

export default toAutocompleteSuggestion;
