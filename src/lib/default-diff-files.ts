/**
 * A glob to ignore map files and minified files as these are not readable to humans.
 * This is applied whenever you use the UI without any diffFiles. It is not appleid
 * when using the API. Having hidden defaults in an API feels like a bad idea.
 */
export const DEFAULT_DIFF_FILES_GLOB = "**/!(*.map|*.min.js)" as const;
