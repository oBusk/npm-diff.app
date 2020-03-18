export function parsePackageString(
    packageString: string,
): {
    name: string;
    versionOrTag: string | null;
    scoped: boolean;
} {
    let name: string;
    let versionOrTag: string | null;
    let scoped = false;
    packageString = packageString.trim();
    const lastAtIndex = packageString.lastIndexOf("@");

    if (packageString.startsWith("@")) {
        scoped = true;
        if (lastAtIndex === 0) {
            name = packageString;
            versionOrTag = null;
        } else {
            packageString.slice(0, lastAtIndex);
            name = packageString.substring(0, lastAtIndex);
            versionOrTag = packageString.substring(lastAtIndex + 1);
        }
    } else {
        if (lastAtIndex === -1) {
            name = packageString;
            versionOrTag = null;
        } else {
            name = packageString.substring(0, lastAtIndex);
            versionOrTag = packageString.substring(lastAtIndex + 1);
        }
    }

    return { name, versionOrTag, scoped };
}
