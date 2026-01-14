/**
 * Simple client-side package spec parser.
 * Only parses basic version specs, doesn't support all npa features.
 * Used for client-side validation and filtering.
 * 
 * NOTE: This is a simplified parser for browser use. It has limitations:
 * - Only handles basic "@" separated specs (e.g., "react@18.0.0")
 * - Doesn't handle all edge cases that npm-package-arg handles
 * - Used only for autocomplete filtering, not for critical logic
 * 
 * For server-side use, always use npm-package-arg via @internal/npm-spec.
 */
export interface SimpleNpaResult {
    type: string;
    name: string | null;
    rawSpec: string;
}

/**
 * Simple client-side implementation of package spec parsing.
 * Does NOT support all npm-package-arg features, only basic version specs.
 */
export function parsePackageSpec(spec: string): SimpleNpaResult {
    // Handle scoped packages: @scope/name@version
    const scopedMatch = spec.match(/^(@[^/]+\/[^@]+)@(.*)$/);
    if (scopedMatch) {
        return {
            type: "version",
            name: scopedMatch[1],
            rawSpec: scopedMatch[2],
        };
    }

    // Handle regular packages: name@version
    const regularMatch = spec.match(/^([^@]+)@(.*)$/);
    if (regularMatch) {
        return {
            type: "version",
            name: regularMatch[1],
            rawSpec: regularMatch[2],
        };
    }

    // No @ found, treat as package name without version
    // Note: This is simplified - real npa would handle this differently
    return {
        type: "tag",
        name: spec,
        rawSpec: "",
    };
}
