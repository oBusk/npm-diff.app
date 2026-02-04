import { type Metadata } from "next";

/**
 * Generate metadata for catalog pages
 */
export function generateCatalogMetadata(packageName: string): Metadata {
    return {
        title: `${packageName} - npm Package Catalog`,
        description: `Browse and compare different versions of the ${packageName} npm package. View suggested version comparisons including major, minor, and patch updates.`,
        keywords: [
            packageName,
            "npm",
            "package",
            "version",
            "diff",
            "comparison",
            "changelog",
        ],
        openGraph: {
            title: `${packageName} - npm Package Catalog`,
            description: `Browse and compare different versions of the ${packageName} npm package`,
            type: "website",
        },
    };
}
