/**
 * Displays a faded package name prefix (e.g., "react@")
 * Used in comparison displays to de-emphasize the package name
 * and focus attention on the version number
 */
export default function PackageNamePrefix({
    packageName,
}: {
    packageName: string;
}) {
    return <span className="text-muted-foreground">{packageName}@</span>;
}
