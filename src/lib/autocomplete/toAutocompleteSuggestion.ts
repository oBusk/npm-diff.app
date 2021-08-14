import Result from "lib/npms/Result";
import { Suggestion } from "lib/npms/suggestions";
import AutocompleteSuggestion from "./AutocompleteSuggestion";

const toAutocompleteSuggestion = ({
    package: { name, description },
}: Result | Suggestion): AutocompleteSuggestion => ({
    name,
    description,
});

export default toAutocompleteSuggestion;
