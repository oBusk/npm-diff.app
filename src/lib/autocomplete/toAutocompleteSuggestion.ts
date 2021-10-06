import AutocompleteSuggestion from "./AutocompleteSuggestion";
import Result from "-/lib/api/npms/Result";
import { Suggestion } from "-/lib/api/npms/suggestions";

const toAutocompleteSuggestion = ({
    package: { name, description },
}: Result | Suggestion): AutocompleteSuggestion => ({
    name,
    description,
});

export default toAutocompleteSuggestion;
