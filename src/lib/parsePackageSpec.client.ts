/**
 * Simple client-side package spec parser.
 * Only parses basic version specs, doesn't support all npa features.
 * Used for client-side validation and filtering.
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
    return {
        type: "tag",
        name: spec,
        rawSpec: "",
    };
}
