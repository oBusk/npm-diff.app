export function prettyByte(bytes: number): string {
    if (bytes < 1024 && bytes > -1024) {
        return `${bytes} B`;
    } else if (bytes < 1048576 && bytes > -1048576) {
        return `${(bytes / 1024).toFixed(1)} kB`;
    } else {
        return `${(bytes / 1048576).toFixed(1)} MB`;
    }
}
