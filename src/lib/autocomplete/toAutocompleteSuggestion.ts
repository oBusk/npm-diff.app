import Result from "^/lib/api/npms/Result";
import { Suggestion } from "^/lib/api/npms/suggestions";
import AutocompleteSuggestion from "./AutocompleteSuggestion";

const toAutocompleteSuggestion = ({
    package: { name, description },
    highlight,
}: Result & Suggestion): AutocompleteSuggestion =>
    highlight
        ? {
              // @ suffix to start selecting version right away
              value: `${name}@`,
              title: name,
              body: description,
              titleWithHighlight: highlight,
          }
        : {
              // @ suffix to start selecting version right away
              value: `${name}@`,
              title: name,
              body: description,
          };

export default toAutocompleteSuggestion;
