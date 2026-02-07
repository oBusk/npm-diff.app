import npa from "npm-package-arg";

/**
 * Check if the given specs represent a catalog page request
 * (single package name without version specification)
 */
export function isCatalogPage(specs: string[]): boolean {
    if (specs.length !== 1) {
        return false;
    }
    const parsed = npa(specs[0]);
    return parsed.rawSpec === "*" && Boolean(parsed.name);
}

/**
 * Get the package name from catalog page specs
 * Returns null if not a valid catalog page spec
 */
export function getCatalogPackageName(specs: string[]): string | null {
    if (!isCatalogPage(specs)) {
        return null;
    }
    return npa(specs[0]).name;
}
