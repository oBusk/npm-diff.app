// Re-export everything from the internal library
export {
    destination as default,
    destination,
    type Destination,
    type Redirect,
    versionsToSpecs,
} from "@internal/npm-spec";

// Export the cached version of canonicalSpec
export { default as canonicalSpec } from "./canonicalSpec";
