import Result from "^/lib/api/npms/Result";
import { Suggestion } from "^/lib/api/npms/suggestions";
import AutocompleteSuggestion from "./AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "./AutocompleteSuggestionTypes";

const packageSuggestion = ({
    package: { name, description },
    highlight,
}: Result & Suggestion): AutocompleteSuggestion =>
    highlight
        ? {
              type: AutocompleteSuggestionTypes.Package,
              // @ suffix to start selecting version right away
              value: `${name}@`,
              title: name,
              body: description,
              titleWithHighlight: highlight,
          }
        : {
              type: AutocompleteSuggestionTypes.Package,
              // @ suffix to start selecting version right away
              value: `${name}@`,
              title: name,
              body: description,
          };

export default packageSuggestion;
