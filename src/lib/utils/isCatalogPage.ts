import npa from "npm-package-arg";

/**
 * Check if the given spec represents a catalog page request
 * (single package name without version specification)
 */
export function isCatalogPage(spec: string): boolean {
    const parsed = npa(spec);
    return parsed.rawSpec === "*" && Boolean(parsed.name);
}

/**
 * Get the package name from a catalog page spec
 * Returns null if not a valid catalog page spec
 */
export function getCatalogPackageName(spec: string): string | null {
    if (!isCatalogPage(spec)) {
        return null;
    }
    return npa(spec).name;
}
