import AutocompleteSuggestion from "./AutocompleteSuggestion";
import Result from "-/lib/api/npms/Result";
import { Suggestion } from "-/lib/api/npms/suggestions";

const toAutocompleteSuggestion = ({
    package: { name, description },
    highlight,
}: Result & Suggestion): AutocompleteSuggestion =>
    highlight
        ? {
              name,
              description,
              highlight,
          }
        : {
              name,
              description,
          };

export default toAutocompleteSuggestion;
