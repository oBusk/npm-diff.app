import type AutocompleteSuggestionTypes from "./AutocompleteSuggestionTypes";

interface AutocompleteSuggestion {
    type: AutocompleteSuggestionTypes;
    /** The value that the item represents, what will be in the input if selected */
    value: string;
    /** The title to show for the item. e.g. Packagename or Packagename@1.2.3 */
    name: string;
    /** The version of the package, if available */
    version?: string;
    /** The timestamp of the publication of the package, if available */
    time?: string;
    /** A small description to show below the title in the dropdown */
    body?: string;
    tags?: string[];
}

export default AutocompleteSuggestion;
