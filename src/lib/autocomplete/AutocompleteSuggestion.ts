import AutocompleteSuggestionTypes from "./AutocompleteSuggestionTypes";

interface AutocompleteSuggestion {
    type: AutocompleteSuggestionTypes;
    /** The value that the item represents, what will be in the input if selected */
    value: string;
    /** The title to show for the item. e.g. Packagename or Packagename@1.2.3 */
    title: string;
    /** The title to show, with `em` tags to show what part of the title that matched.
     * e.g. query: "rea" -> title: "react" -> titleWithHighlight: "<em>rea</em>ct"
     */
    titleWithHighlight?: string;
    /** A small description to show below the title in the dropdown */
    body?: string;
}

export default AutocompleteSuggestion;
