enum AutocompleteSuggestionTypes {
    /**
     * Suggesting a package name without any version. e.g. "react"
     */
    Package,
    /**
     * Suggesting a package and version. e.g. "react@16.1.2"
     */
    Version,
}

export default AutocompleteSuggestionTypes;
